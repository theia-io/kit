import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FeatKudoBoardActions,
  FeatKudoBoardAnalyticsActions,
  FeatKudoBoardCommentActions,
  FeatKudoBoardReactionActions,
  selectKudoBoardById,
} from '@kitouch/data-kudoboard';
import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import { ofType } from '@ngrx/effects';

import { followerHandlerFn } from '@kitouch/follow-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { KudoBoard, KudoBoardStatus, Profile } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  UiKitPageOverlayComponent,
} from '@kitouch/ui-components';
import {
  FeatKudoBoardActionsComponent,
  FeatKudoBoardCommentsComponent,
  FeatKudoboardInfoPanelComponent,
  FeatKudoBoardStatusComponent,
  FeatKudoBoardViewAdditionalActionsComponent,
  FeatKudoBoardViewComponent,
} from '@kitouch/ui-kudoboard';

import { select, Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';

import { AuthorizedFeatureDirective } from '@kitouch/containers';
import {
  FeatFarewellActions,
  findProfileFarewells,
  selectFarewells,
} from '@kitouch/feat-farewell-data';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import { DeviceService, objectLoadingState$ } from '@kitouch/shared-services';
import { ToastModule } from 'primeng/toast';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';

/**
 * Component has 5 states
 *  1. When "previewed by admin"
 *  2. When "viewed by the person who this is for"
 *  3. When being viewed publicly
 *    3.1 collecting responses
 *    3.2 just being viewed
 */
@Component({
  standalone: true,
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  imports: [
    AsyncPipe,
    RouterModule,
    //
    ButtonModule,
    BreadcrumbModule,
    ToastModule,
    //
    AccountTileComponent,
    FeatKitProfileHeaderComponent,
    FeatKudoBoardActionsComponent,
    FeatKudoBoardViewComponent,
    FeatKudoBoardCommentsComponent,
    UiKitPageOverlayComponent,
    FeatKudoBoardViewAdditionalActionsComponent,
    AuthorizedFeatureDirective,
    FeatKudoBoardStatusComponent,
    FeatKudoboardInfoPanelComponent,
  ],
  providers: [MessageService],
})
export class PageKudoBoardViewComponent {
  // for owner to preview component
  preview = input(false);
  // for recipients
  view = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);
  device$ = inject(DeviceService).device$;
  #messageService = inject(MessageService);

  #followerHandlerFn = followerHandlerFn();

  kudoboardId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay()
  );
  kudoboard$ = this.kudoboardId$.pipe(
    switchMap((kudoboardId) =>
      this.#store.pipe(select(selectKudoBoardById(kudoboardId)))
    ),
    filter(Boolean)
  );
  #kudoBoard = toSignal(this.kudoboard$);

  kudoboardLoadingState = toSignal(
    objectLoadingState$<KudoBoard>({
      loadingAction$: (actions) =>
        actions.pipe(ofType(FeatKudoBoardActions.getKudoBoard)),
      loadedAction$: (actions) =>
        actions.pipe(ofType(FeatKudoBoardActions.getKudoBoardSuccess)),
      loadingErrorAction$: (actions) =>
        actions.pipe(ofType(FeatKudoBoardActions.getKudoBoardFailure)),
    })
  );

  #kudoProfile$ = this.kudoboard$.pipe(
    filter(
      ({ profileId, profile: kudoboardSavedProfile }) =>
        !!(profileId ?? kudoboardSavedProfile?.id)
    ),
    switchMap(({ profileId, profile: kudoboardSavedProfile }) =>
      this.#store
        .select(selectProfileById((profileId ?? kudoboardSavedProfile?.id)!))
        .pipe(map((profile) => profile ?? kudoboardSavedProfile))
    ),
    startWith(null)
  );

  kudoboardProfile = toSignal(this.#kudoProfile$);
  kudoboardProfilePic = computed(() => profilePicture(this.kudoboardProfile()));

  #currentProfile$ = this.#store.pipe(select(selectCurrentProfile));
  currentProfile = toSignal(this.#currentProfile$);
  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.kudoboardProfile()?.id
      ) ?? false
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.kudoboard$,
  ]).pipe(
    map(([_, kudoboard]) => [
      {
        label: 'All KudoBoards',
        routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: kudoboard.title,
      },
    ])
  );

  kudoOwner = computed(() => {
    return (
      this.kudoboardProfile() &&
      this.currentProfile() &&
      this.kudoboardProfile()?.id === this.currentProfile()?.id
    );
  });

  kudoBoardProfileTexts = computed(() => {
    const kudoboardProfile = this.kudoboardProfile();
    if (!kudoboardProfile) {
      return {
        primaryText: '',
        secondaryText: '',
      };
    }

    if (this.view()) {
      return {
        primaryText: `${kudoboardProfile.name}`,
        secondaryText: `collected people's thoughts for ${
          this.#kudoBoard()?.recipient ?? ''
        })`,
      };
    }

    return {
      primaryText: `Join ${kudoboardProfile.name}`,
      secondaryText: `... in collecting your thoughts for ${
        this.#kudoBoard()?.recipient ?? 'someone'
      })`,
    };
  });

  kudoBoardOverlayText$ = this.kudoboard$.pipe(
    map(({ status, profile }) => {
      const profileContact = profile?.name
        ? `Contact owner: ${profile.name}`
        : '';
      if (status === KudoBoardStatus.Draft) {
        return `This Kudo is still in Draft. ${profileContact}`;
      }

      if (status === KudoBoardStatus.Removed) {
        return `This Kudo is removed. ${profileContact}`;
      }

      return '';
    })
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
    this.kudoboard$,
  ]).pipe(
    map(([myFarewells, kudoBoard]) =>
      myFarewells.filter(
        (myFarewell) => myFarewell.kudoBoardId === kudoBoard?.id
      )
    )
  );

  commentsSideBarVisibility = signal(false);
  kudoBoardStatus = KudoBoardStatus;

  readonly profileUrl = `/${APP_PATH.Profile}/`;

  constructor() {
    this.kudoboardId$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((id) => {
        this.#store.dispatch(FeatKudoBoardActions.getKudoBoard({ id }));
        this.#store.dispatch(
          FeatKudoBoardAnalyticsActions.getAnalyticsKudoBoard({
            kudoBoardId: id,
          })
        );
        this.#store.dispatch(
          FeatKudoBoardReactionActions.getReactionsKudoBoard({
            kudoBoardId: id,
          })
        );
        this.#store.dispatch(
          FeatKudoBoardCommentActions.getCommentsKudoBoard({ kudoboardId: id })
        );
      });

    this.#currentProfile$
      .pipe(takeUntilDestroyed(), filter(Boolean), take(1))
      .subscribe((profile) =>
        this.#store.dispatch(
          FeatFarewellActions.getProfileFarewells({ profileId: profile.id })
        )
      );

    // Clear claim message after claimed
    this.#kudoProfile$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => !prev && !!curr?.id),
        take(1),
        takeUntilDestroyed()
      )
      .subscribe(() => this.#messageService.clear());

    // Show claim message
    this.#kudoProfile$
      .pipe(
        debounceTime(2000),
        filter((profile) => !profile?.id),
        take(1),
        takeUntilDestroyed()
      )
      .subscribe(() =>
        this.#messageService.add({
          sticky: true,
          severity: 'info',
          summary: 'Claim this Kudo board',
          detail:
            'This Kudo board is not claimed yet. To own it click on "Claim".',
        })
      );
  }

  signInAndFollow(profileToFollow: Profile) {
    this.#auth0Service
      .signInTab()
      .then(() => this.#followAfterSignIn(profileToFollow));
  }

  #followAfterSignIn(profile: Profile) {
    this.#followerHandlerFn(profile.id, true);
  }
}
