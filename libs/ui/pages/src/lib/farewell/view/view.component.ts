import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { farewellLink } from '@kitouch/containers';
import {
  FeatFarewellActions,
  FeatFarewellCommentActions,
  FeatFarewellReactionActions,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import {
  FeatFarewellActionsComponent,
  FeatFarewellCommentsComponent,
  FeatFarewellInfoPanelComponent,
  FeatFarewellStatusComponent,
  FeatFarewellViewV2Component,
} from '@kitouch/feat-farewell-ui';
import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import {
  FeatFollowUnfollowProfileComponent,
  followerHandlerFn,
} from '@kitouch/follow-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Auth0Service, DeviceService } from '@kitouch/shared-infra';
import { Farewell, FarewellStatus, Profile } from '@kitouch/shared-models';
import { objectLoadingState$ } from '@kitouch/shared-services';
import { UiKitPageOverlayComponent } from '@kitouch/ui-components';

import { ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
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
    SidebarModule,
    //
    UiKitPageOverlayComponent,
    FeatKitProfileHeaderComponent,
    FeatFarewellActionsComponent,
    FeatFarewellViewV2Component,
    FeatFarewellCommentsComponent,
    FeatFollowUnfollowProfileComponent,
    FeatFarewellStatusComponent,
    FeatFarewellInfoPanelComponent,
  ],
})
export class PageFarewellViewComponent {
  preview = input(false);

  #document = inject(DOCUMENT);
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  device$ = inject(DeviceService).device$;
  #followerHandlerFn = followerHandlerFn();

  farewellId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay()
  );

  farewell$ = this.farewellId$.pipe(
    switchMap((farewellId) =>
      this.#store.pipe(select(selectFarewellById(farewellId)))
    ),
    filter(Boolean)
  );

  farewellProfile = toSignal(
    this.farewell$.pipe(
      switchMap(({ profile: farewellSavedProfile, profileId }) =>
        this.#store
          .select(selectProfileById(profileId))
          .pipe(map((profile) => profile ?? farewellSavedProfile))
      )
    )
  );

  profilePictureFn = profilePicture;
  farewellProfilePic = computed(() =>
    this.profilePictureFn(this.farewellProfile())
  );

  currentProfile = this.#store.selectSignal(selectCurrentProfile);

  farewellLoadingState = toSignal(
    objectLoadingState$<Farewell>({
      loadingAction$: (actions) =>
        actions.pipe(ofType(FeatFarewellActions.getFarewell)),
      loadedAction$: (actions) =>
        actions.pipe(ofType(FeatFarewellActions.getFarewellSuccess)),
      loadingErrorAction$: (actions) =>
        actions.pipe(ofType(FeatFarewellActions.getFarewellFailure)),
    })
  );

  kudoBoardOverlayText$ = this.farewell$.pipe(
    map(({ status, profile }) => {
      const profileContact = profile?.name
        ? `Contact owner: ${profile.name}`
        : '';
      if (status === FarewellStatus.Draft) {
        return `This Farewell is still in Draft. ${profileContact}`;
      }

      if (status === FarewellStatus.Removed) {
        return `This farewell is removed. ${profileContact}`;
      }

      return '';
    })
  );

  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.farewellProfile()?.id
      ) ?? false
  );

  linkedKudoBoard$ = this.farewell$.pipe(
    map((farewell) => farewell?.kudoBoard),
    filter(Boolean)
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.farewell$,
  ]).pipe(
    map(([_, farewell]) => [
      {
        label: 'All Farewells',
        routerLink: `/${APP_PATH.Farewell}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: farewell.title,
      },
    ])
  );

  commentsSideBarVisibility = signal(false);
  farewellStatus = FarewellStatus;
  readonly profileUrl = `/${APP_PATH.Profile}/`;
  readonly kudoBoardPartialUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
  // TODO Check if I can pass farewellId and get rid of HOF here (if parameter is evaluated lazily)
  farewellLinkFn = (farewellId: string) =>
    farewellLink(this.#document.location.origin, farewellId);

  constructor() {
    this.farewellId$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((id) => {
        this.#store.dispatch(FeatFarewellActions.getFarewell({ id }));
        this.#store.dispatch(
          FeatFarewellActions.getAnalyticsFarewell({ farewellId: id })
        );
        this.#store.dispatch(
          FeatFarewellReactionActions.getReactionsFarewell({ farewellId: id })
        );
        this.#store.dispatch(
          FeatFarewellCommentActions.getCommentsFarewell({ farewellId: id })
        );
      });
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
