import { AsyncPipe, DOCUMENT, NgOptimizedImage } from '@angular/common';
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
  startWith,
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
    UiLogoComponent,
    UIKitSmallerHintTextUXDirective,
    FeatFollowSuggestionByIdComponent,
    FeatFollowUnfollowProfileComponent,
  ],
})
export class PageKudoBoardViewComponent {
  preview = input(false);

  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);
  #document = inject(DOCUMENT);
  #authService = inject(AuthService);

  device$ = inject(DeviceService).device$;
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
  kudoboardProfile = toSignal(
    this.kudoboard$.pipe(
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
    )
  );
  kudoboardProfilePic = computed(() => profilePicture(this.kudoboardProfile()));

  currentProfile = this.#store.selectSignal(selectCurrentProfile);
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
        label: 'KudoBoards',
        routerLink: `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`,
        icon: 'pi pi-send mr-2',
        iconClass: 'text-lg font-semibold',
        styleClass: 'text-lg font-semibold',
      },
      {
        label: kudoboard.title,
      },
    ])
  );

  copied = signal(false);
  commentsSideBarVisibility = signal(false);

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
  }

  signInAndFollow(profileToFollow: Profile) {
    this.#authService
      .googleSignIn()
      .then(() => this.#followAfterSignIn(profileToFollow));
  }

  copyToClipBoard(kudoboardId: string) {
    navigator.clipboard.writeText(this.#url(kudoboardId));
    this.copied.set(true);
    // @TODO add also bubbling text saying that copied
    setTimeout(() => {
      this.copied.set(false);
    }, 5000);
  }

  #url(kudoboardId: string) {
    return [
      this.#document.location.origin,
      's',
      APP_PATH_ALLOW_ANONYMOUS.KudoBoard,
      kudoboardId,
    ].join('/');
  }

  #followAfterSignIn(profile: Profile) {
    this.#followerHandlerFn(profile.id, true);
  }
}
