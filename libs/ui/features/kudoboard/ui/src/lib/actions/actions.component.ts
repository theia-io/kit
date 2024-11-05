import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import {
  FeatKudoBoardActions,
  FeatKudoBoardReactionActions,
  selectKudoBoardById,
  selectKudoBoardReactionsById,
} from '@kitouch/data-kudoboard';
import { emojiNameMap } from '@kitouch/emoji';

import {
  profilePicture,
  selectCurrentProfile,
  selectProfilesByIds,
} from '@kitouch/kit-data';
import { KudoBoard, KudoBoardReaction, Profile } from '@kitouch/shared-models';
import { AccountTileComponent } from '@kitouch/ui-components';
import {
  APP_PATH,
  APP_PATH_ALLOW_ANONYMOUS,
  AuthorizedFeatureDirective,
} from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { kudoBoardOwner } from '../common';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-actions',
  templateUrl: './actions.component.html',
  imports: [
    AsyncPipe,
    RouterModule,
    //
    PickerComponent,
    ButtonModule,
    OverlayPanelModule,
    TooltipModule,
    //
    AccountTileComponent,
    AuthorizedFeatureDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardActionsComponent {
  kudoboardId = input.required<KudoBoard['id']>();

  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);

  #kudoboardId$ = toObservable(this.kudoboardId).pipe(filter(Boolean));
  kudoboard = computed(() =>
    this.#store.selectSignal(selectKudoBoardById(this.kudoboardId()))()
  );

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  canEdit = computed(() =>
    kudoBoardOwner({
      kudoboard: this.kudoboard(),
      currentProfile: this.currentProfile(),
    })
  );

  kudoBoardReactions$ = this.#kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardReactionsById(kudoboardId)))
    ),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  kudoBoardReactionsLength = toSignal(
    this.kudoBoardReactions$.pipe(map((reactions) => reactions.length)),
    { initialValue: 0 }
  );
  kudoBoardProfileReactionsMap$ = this.kudoBoardReactions$.pipe(
    map((reactions) => {
      const kudoBoardProfileReactionsMap = new Map<
        Profile['id'] | null,
        Array<KudoBoardReaction>
      >();

      reactions.forEach((reaction) => {
        const profileId = reaction.profileId ?? null;

        const kudoBoardProfileReactions =
          kudoBoardProfileReactionsMap.get(profileId) ?? [];

        kudoBoardProfileReactionsMap.set(profileId, [
          ...kudoBoardProfileReactions,
          reaction,
        ]);
      });

      return kudoBoardProfileReactionsMap;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  resolvedReactionProfilesMap = toSignal(
    this.kudoBoardProfileReactionsMap$.pipe(
      switchMap((kudoBoardProfileReactions) =>
        this.#store.pipe(
          select(
            selectProfilesByIds(
              [...kudoBoardProfileReactions.keys()].filter(
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

  readonly profilePicture = profilePicture;
  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  readonly emojiMap = emojiNameMap;

  randomReaction(emojiList: Array<KudoBoardReaction>) {
    const length = emojiList.length;
    return emojiList[Math.floor(length * Math.random())].content;
  }

  reactionClickHandler(emoji: string) {
    this.#store.dispatch(
      FeatKudoBoardReactionActions.postReactionKudoBoard({
        reaction: {
          kudoBoardId: this.kudoboardId(),
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

  removeReactionHandler(reaction: KudoBoardReaction) {
    const kudoBoardOwner =
      this.kudoboard()?.profile?.id === this.currentProfile()?.id;
    const currentReactionOwner =
      this.currentProfile()?.id === reaction.profileId;
    if (kudoBoardOwner || currentReactionOwner) {
      this.#store.dispatch(
        FeatKudoBoardReactionActions.deleteReactionKudoBoard({
          id: reaction.id,
        })
      );
      return;
    }

    console.error('Cannot remove this reaction from different profile');
    return;
  }

  redirectToEdit() {
    this.#router.navigateByUrl(
      `s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/${this.kudoboardId()}/edit`
    );
  }

  claimKudoBoard() {
    console.log('claimKudoBoard');
    const kudoBoard = this.kudoboard();
    if (!kudoBoard) {
      console.log('[FeatKudoBoardActionsComponent][claimKudoBoard]', kudoBoard);
      return;
    }

    this.#store
      .pipe(
        select(selectCurrentProfile),
        takeUntilDestroyed(this.#destroyRef),
        filter(Boolean)
      )
      .subscribe((currentProfile) =>
        this.#store.dispatch(
          FeatKudoBoardActions.putKudoBoard({
            kudoboard: {
              ...kudoBoard,
              profileId: currentProfile.id,
              profile: currentProfile,
            },
          })
        )
      );
  }
}
