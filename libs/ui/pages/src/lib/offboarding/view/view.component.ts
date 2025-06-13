import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import { ofType } from '@ngrx/effects';

import { followerHandlerFn } from '@kitouch/follow-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import {
  ExpOffboardingStatus,
  KudoBoard,
  Profile,
} from '@kitouch/shared-models';
import { UiKitPageOverlayComponent } from '@kitouch/ui-components';

import { select, Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';

import {
  FeatExpOffboardingActions,
  FeatExpOffboardingAnalyticsActions,
  selectExpOffboardingById,
} from '@kitouch/feat-offboarding-data';
import {
  FeatOffboardingInfoPanelComponent,
  FeatOffboardingStatusComponent,
} from '@kitouch/feat-offboarding-ui';
import { APP_PATH, APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import { DeviceService, objectLoadingState$ } from '@kitouch/shared-services';
import { ToastModule } from 'primeng/toast';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
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
  selector: 'kit-page-offboarding-view',
  templateUrl: './view.component.html',
  imports: [
    AsyncPipe,
    RouterModule,
    //
    ButtonModule,
    BreadcrumbModule,
    ToastModule,
    //
    FeatKitProfileHeaderComponent,
    FeatOffboardingInfoPanelComponent,
    FeatOffboardingStatusComponent,
    UiKitPageOverlayComponent,
  ],
  providers: [MessageService],
})
export class PageOffboardingViewComponent {
  // for owner to preview component
  preview = input(false);
  // for recipients
  view = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #messageService = inject(MessageService);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);
  device$ = inject(DeviceService).device$;

  #followerHandlerFn = followerHandlerFn();

  offboardingId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
    shareReplay()
  );
  offboarding$ = this.offboardingId$.pipe(
    switchMap((offboardingId) =>
      this.#store.pipe(select(selectExpOffboardingById(offboardingId)))
    ),
    filter(Boolean)
  );

  offboardingLoadingState = toSignal(
    objectLoadingState$<KudoBoard>({
      loadingAction$: (actions) =>
        actions.pipe(ofType(FeatExpOffboardingActions.getExpOffboarding)),
      loadedAction$: (actions) =>
        actions.pipe(
          ofType(FeatExpOffboardingActions.getExpOffboardingSuccess)
        ),
      loadingErrorAction$: (actions) =>
        actions.pipe(
          ofType(FeatExpOffboardingActions.getExpOffboardingFailure)
        ),
    })
  );

  #offboardingProfile$ = this.offboarding$.pipe(
    filter(({ profileId }) => !!profileId),
    switchMap(({ profileId }) =>
      this.#store
        .select(selectProfileById(profileId))
        .pipe(map((profile) => profile))
    ),
    startWith(null)
  );

  offboardingProfile = toSignal(this.#offboardingProfile$);
  offboardingProfilePic = computed(() =>
    profilePicture(this.offboardingProfile())
  );

  #currentProfile$ = this.#store.pipe(select(selectCurrentProfile));
  currentProfile = toSignal(this.#currentProfile$);
  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.offboardingProfile()?.id
      ) ?? false
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.offboarding$,
  ]).pipe(
    map(([_, offboarding]) => [
      {
        label: 'Offboardings',
        routerLink: `/app/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}`,
        icon: 'pi pi-heart-fill mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: offboarding.title,
      },
    ])
  );

  offboardingOwner = computed(() => {
    return (
      this.offboardingProfile() &&
      this.currentProfile() &&
      this.offboardingProfile()?.id === this.currentProfile()?.id
    );
  });

  offboardingOverlayText$ = this.offboarding$.pipe(
    map(({ status, profile }) => {
      const profileContact = profile.name
        ? `Contact owner: ${profile.name}`
        : '';
      if (status === ExpOffboardingStatus.Draft) {
        return `This offboarding is still in Draft. ${profileContact}`;
      }

      if (status === ExpOffboardingStatus.Deleted) {
        return `This offboarding is removed. ${profileContact}`;
      }

      return '';
    })
  );

  commentsSideBarVisibility = signal(false);
  offboardingStatus = ExpOffboardingStatus;

  readonly profileUrl = `/${APP_PATH.Profile}/`;

  constructor() {
    this.offboardingId$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((id) => {
        this.#store.dispatch(
          FeatExpOffboardingActions.getExpOffboarding({ id })
        );
        this.#store.dispatch(
          FeatExpOffboardingAnalyticsActions.getAnalyticsExpOffboarding({
            offboardingId: id,
          })
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
