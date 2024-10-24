import { AsyncPipe, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FeatFarewellActions,
  FeatFarewellCommentActions,
  FeatFarewellReactionActions,
  selectFarewellById,
} from '@kitouch/feat-farewell-data';
import {
  FeatFarewellActionsComponent,
  FeatFarewellAnalyticsComponent,
  FeatFarewellCommentsComponent,
  FeatFarewellViewV2Component,
} from '@kitouch/feat-farewell-ui';
import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import {
  FeatFollowSuggestionByIdComponent,
  FeatFollowUnfollowProfileComponent,
  followerHandlerFn,
} from '@kitouch/follow-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { UIKitSmallerHintTextUXDirective } from '@kitouch/ui-components';
import {
  APP_PATH,
  APP_PATH_ALLOW_ANONYMOUS,
  AuthService,
  DeviceService,
  UiLogoComponent,
} from '@kitouch/ui-shared';
import { select, Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TagModule } from 'primeng/tag';
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
    NgOptimizedImage,
    //
    ButtonModule,
    TagModule,
    BreadcrumbModule,
    SidebarModule,
    //
    FeatKitProfileHeaderComponent,
    FeatFarewellActionsComponent,
    UiLogoComponent,
    UIKitSmallerHintTextUXDirective,
    FeatFarewellViewV2Component,
    FeatFarewellAnalyticsComponent,
    FeatFarewellCommentsComponent,
    FeatFollowSuggestionByIdComponent,
    FeatFollowUnfollowProfileComponent,
  ],
})
export class PageFarewellViewComponent {
  preview = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #document = inject(DOCUMENT);
  #authService = inject(AuthService);

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
      switchMap(({ profile: farewellSavedProfile }) =>
        this.#store
          .select(selectProfileById(farewellSavedProfile.id))
          .pipe(map((profile) => profile ?? farewellSavedProfile))
      )
    )
  );
  farewellProfilePic = computed(() => profilePicture(this.farewellProfile()));

  currentProfile = this.#store.selectSignal(selectCurrentProfile);
  isFollowing = computed(
    () =>
      this.currentProfile()?.following?.some(
        ({ id }) => id === this.farewellProfile()?.id
      ) ?? false
  );

  breadcrumbMenuItems$: Observable<Array<MenuItem>> = combineLatest([
    this.#activatedRouter.url,
    this.farewell$,
  ]).pipe(
    map(([_, farewell]) => [
      {
        label: 'Farewells',
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

  copied = signal(false);
  commentsSideBarVisibility = signal(false);

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
    this.#authService
      .googleSignIn()
      .then(() => this.#followAfterSignIn(profileToFollow));
  }

  copyToClipBoard(farewellId: string) {
    navigator.clipboard.writeText(this.#url(farewellId));
    this.copied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.copied.set(false);
    }, 5000);
  }

  #url(farewellId: string) {
    return [
      this.#document.location.origin,
      's',
      APP_PATH_ALLOW_ANONYMOUS.Farewell,
      farewellId,
    ].join('/');
  }

  #followAfterSignIn(profile: Profile) {
    this.#followerHandlerFn(profile.id, true);
  }
}
