import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { emojiNameMap } from '@kitouch/emoji';
import {
  FeatFarewellReactionActions,
  selectFarewellById,
  selectFarewellCommentsById,
  selectFarewellReactionsById,
} from '@kitouch/feat-farewell-data';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfilesByIds,
} from '@kitouch/kit-data';
import { Farewell, FarewellReaction, Profile } from '@kitouch/shared-models';
import { AccountTileComponent } from '@kitouch/ui-components';

import {
  AuthorizedFeatureDirective,
  farewellLink,
  SharedCopyClipboardComponent,
} from '@kitouch/containers';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { farewellOwner } from '../common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'feat-farewell-actions',
  templateUrl: './farewell-actions.component.html',
  styleUrl: './farewell-actions.component.scss',
  imports: [
    AsyncPipe,
    RouterModule,
    //
    AccountTileComponent,
    AuthorizedFeatureDirective,
    SharedCopyClipboardComponent,
    //
    PickerComponent,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellActionsComponent {
  farewellId = input.required<Farewell['id']>();

  commentsClick = output<void>();

  #router = inject(Router);
  #store = inject(Store);
  #document = inject(DOCUMENT);

  #farewellId$ = toObservable(this.farewellId).pipe(filter(Boolean));
  farewell = computed(() =>
    this.#store.selectSignal(selectFarewellById(this.farewellId()))()
  );

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  canEdit = computed(() =>
    farewellOwner({
      farewell: this.farewell(),
      currentProfile: this.currentProfile(),
    })
  );

  farewellCommentsLength = toSignal(
    this.#farewellId$.pipe(
      switchMap((farewellId) =>
        this.#store.pipe(select(selectFarewellCommentsById(farewellId)))
      ),
      map((comments) => comments.length)
    ),
    { initialValue: 0 }
  );
  farewellReactions$ = this.#farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellReactionsById(farewellId)))
    ),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  farewellReactionsLength = toSignal(
    this.farewellReactions$.pipe(map((reactions) => reactions.length)),
    { initialValue: 0 }
  );
  farewellProfileReactionsMap$ = this.farewellReactions$.pipe(
    map((reactions) => {
      const farewellProfileReactionsMap = new Map<
        Profile['id'] | null,
        Array<FarewellReaction>
      >();

      reactions.forEach((reaction) => {
        const profileId = reaction.profileId;

        const farewellProfileReactions =
          farewellProfileReactionsMap.get(profileId) ?? [];
        farewellProfileReactionsMap.set(profileId, [
          ...farewellProfileReactions,
          reaction,
        ]);
      });

      return farewellProfileReactionsMap;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  resolvedReactionProfilesMap = toSignal(
    this.farewellProfileReactionsMap$.pipe(
      switchMap((farewellProfileReactions) =>
        this.#store.pipe(
          select(
            selectProfilesByIds(
              [...farewellProfileReactions.keys()].filter(
                (profileId): profileId is Profile['id'] => !!profileId
              )
            )
          )
        )
      ),
      map((profiles) => {
        const resolvedReactionProfilesMap = new Map<
          Profile['id'] | null,
          Profile | null
        >();

        profiles.forEach((profile) => {
          if (!profile) {
            console.error('Was not able to resolve profile');
          } else {
            resolvedReactionProfilesMap.set(profile.id, profile);
          }
        });

        resolvedReactionProfilesMap.set(null, null);
        return resolvedReactionProfilesMap;
      })
    )
  );

  linkCopied = signal(false);

  // TODO Check if I can pass farewellId and get rid of HOF here (if parameter is evaluated lazily)
  farewellLinkFn = (farewellId: string) =>
    farewellLink(this.#document.location.origin, farewellId);
  readonly profilePicture = profilePicture;
  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  readonly emojiMap = emojiNameMap;

  randomReaction(emojiList: Array<FarewellReaction>) {
    const length = emojiList.length;
    return emojiList[Math.floor(length * Math.random())].content;
  }

  reactionClickHandler(emoji: string) {
    this.#store.dispatch(
      FeatFarewellReactionActions.postReactionFarewell({
        reaction: {
          farewellId: this.farewellId(),
          profileId: this.currentProfile()?.id ?? null,
          profile: this.currentProfile(),
          content: emoji,
        },
      })
    );
  }

  overlayReactionHandler({ emoji }: any) {
    const native = emoji.native;
    if (native) {
      this.reactionClickHandler(native);
    }
  }

  removeReactionHandler(reaction: FarewellReaction) {
    const farewellOwner =
      this.farewell()?.profile?.id === this.currentProfile()?.id;
    const currentReactionOwner =
      this.currentProfile()?.id === reaction.profileId;
    if (farewellOwner || currentReactionOwner) {
      this.#store.dispatch(
        FeatFarewellReactionActions.deleteReactionFarewell({ id: reaction.id })
      );
      return;
    }

    console.error('Cannot remove this reaction from different profile');
    return;
  }

  redirectToEdit() {
    this.#router.navigateByUrl(
      `/${APP_PATH.Farewell}/edit/${this.farewellId()}`
    );
  }
}
