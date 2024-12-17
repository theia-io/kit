import { AsyncPipe, DatePipe } from '@angular/common';
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
  selectKudoBoardCommentsById,
  selectKudoBoardReactionsById,
} from '@kitouch/data-kudoboard';
import { emojiNameMap } from '@kitouch/emoji';

import {
  FeatFarewellActions,
  FeatFarewellCommentActions,
  findProfileFarewells,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfilesByIds,
} from '@kitouch/kit-data';
import {
  FarewellStatus,
  KudoBoard,
  KudoBoardComment,
  KudoBoardReaction,
  Profile,
} from '@kitouch/shared-models';
import {
  AccountTileComponent,
  UiKitCompAnimatePingComponent,
} from '@kitouch/ui-components';

import { AuthorizedFeatureDirective } from '@kitouch/containers';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { combineLatest, filter, map, shareReplay, switchMap, take } from 'rxjs';
import { kudoBoardOwner } from '../common';
import { FeatKudoBoardViewAdditionalActionsComponent } from '../view-additional-actions/view-additional-actions.component';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-actions',
  templateUrl: './actions.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterModule,
    //
    PickerComponent,
    ButtonModule,
    OverlayPanelModule,
    TooltipModule,
    //
    AccountTileComponent,
    AuthorizedFeatureDirective,
    UiKitCompAnimatePingComponent,
    FeatKudoBoardViewAdditionalActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardActionsComponent {
  kudoboardId = input.required<KudoBoard['id']>();

  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #actions = inject(Actions);
  #store = inject(Store);

  #kudoboardId$ = toObservable(this.kudoboardId).pipe(filter(Boolean));
  #kudoboard$ = this.#kudoboardId$.pipe(
    switchMap((id) => this.#store.pipe(select(selectKudoBoardById(id))))
  );
  kudoboard = computed(() =>
    this.#store.selectSignal(selectKudoBoardById(this.kudoboardId()))()
  );

  #currentProfile$ = this.#store.pipe(select(selectCurrentProfile));
  currentProfile = toSignal(this.#currentProfile$);

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

  #myFarewells$ = combineLatest([
    this.#store.pipe(select(selectFarewells), filter(Boolean)),
    this.#currentProfile$.pipe(filter(Boolean)),
  ]).pipe(
    map(([farewells, currentProfile]) =>
      findProfileFarewells(currentProfile.id, farewells)
    )
  );

  myFarewellsKudoResponses$ = combineLatest([
    this.#myFarewells$,
    this.#kudoboard$,
  ]).pipe(
    map(([myFarewells, kudoBoard]) =>
      myFarewells.filter(
        (myFarewell) => myFarewell.kudoBoardId === kudoBoard?.id
      )
    )
  );

  readonly profilePicture = profilePicture;
  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  readonly farewellUrlPath = `/${APP_PATH.Farewell}/`;
  readonly farewellViewUrlPath = `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}/`;

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

  createKudoBoardResponse(kudoBoard: KudoBoard) {
    const farewellCreated$ = this.#actions.pipe(
      ofType(FeatFarewellActions.createFarewellSuccess),
      takeUntilDestroyed(this.#destroyRef),
      map(({ farewell }) => farewell),
      take(1),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    farewellCreated$.subscribe(({ id }) =>
      this.#router.navigateByUrl(`${this.farewellUrlPath}edit/${id}`)
    );

    farewellCreated$
      .pipe(
        switchMap(({ id }) =>
          this.#store.pipe(
            select(selectKudoBoardCommentsById(kudoBoard.id)),
            map((kudoBoardComments): [string, Array<KudoBoardComment>] => [
              id,
              kudoBoardComments,
            ])
          )
        )
      )
      .subscribe(([farewellId, kudoBoardComments]) => {
        if (kudoBoardComments.length > 0) {
          this.#store.dispatch(
            FeatFarewellCommentActions.batchCommentsFarewell({
              comments: kudoBoardComments.map(
                ({ profile, profileId, content }) => ({
                  farewellId,
                  profileId,
                  profile,
                  content,
                })
              ),
            })
          );
        }
      });

    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter(Boolean),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((profile) => {
        this.#store.dispatch(
          FeatFarewellActions.createFarewell({
            title: '',
            content: '',
            profileId: profile.id,
            profile,
            kudoBoardId: kudoBoard.id,
            kudoBoard,
            status: FarewellStatus.Draft,
          })
        );
      });
  }

  claimKudoBoard() {
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
