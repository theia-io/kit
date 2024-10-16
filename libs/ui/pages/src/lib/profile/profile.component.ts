import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import { FeatFollowUnfollowProfileComponent } from '@kitouch/follow-ui';
import {
  FeatProfileApiActions,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { Profile } from '@kitouch/shared-models';
import { FollowButtonComponent } from '@kitouch/ui-components';
import { APP_PATH, UXDynamicService } from '@kitouch/ui-shared';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { filter, map, shareReplay, switchMap, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterModule,
    NgOptimizedImage,
    //
    TabMenuModule,
    ButtonModule,
    //
    FeatKitProfileHeaderComponent,
    FeatFollowUnfollowProfileComponent,
    FollowButtonComponent,
  ],
})
export class PageProfileComponent {
  readonly settingsUrl = `/${APP_PATH.Settings}`;

  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);
  #uxDynamicService = inject(UXDynamicService);

  #profileIdOrAlias$ = this.#activatedRouter.params.pipe(
    map((params) => params['profileIdOrAlias'])
  );

  #profile$ = this.#profileIdOrAlias$.pipe(
    switchMap((profileIdOrAlias) =>
      this.#store.select(selectProfileById(profileIdOrAlias))
    ),
    filter(Boolean),
    shareReplay(1)
  );

  profile = toSignal(this.#profile$);
  #currentProfile = toSignal(this.#store.select(selectCurrentProfile));

  isCurrentUserProfile = computed(
    () => this.#currentProfile()?.id === this.profile()?.id
  );
  isFollowing = computed(
    () =>
      this.#currentProfile()?.following?.some(
        ({ id }) => id === this.profile()?.id
      ) ?? false
  );

  tabMenuItems: MenuItem[] = [
    { label: 'Tweets', icon: 'pi pi-inbox', routerLink: 'tweets' },
    { label: 'Experience', icon: 'pi pi-briefcase', routerLink: 'experience' },
    { label: 'Following', icon: 'pi pi-users', routerLink: 'following' },
  ];

  followProfileHandler(profile: Profile | undefined) {
    if (!profile) {
      return;
    }

    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: [
                ...(currentProfile.following ?? []),
                { id: profile.id },
              ],
            },
          })
        );
      });
    this.#uxDynamicService.updateLogo('hello', 5000);
  }

  unFollowProfileHandler(profile: Profile | undefined) {
    if (!profile) {
      return;
    }
    this.#store
      .select(selectCurrentProfile)
      .pipe(filter(Boolean), take(1))
      .subscribe((currentProfile) => {
        this.#store.dispatch(
          FeatProfileApiActions.updateProfile({
            profile: {
              ...currentProfile,
              following: currentProfile.following?.filter(
                ({ id }) => id !== profile.id
              ),
            },
          })
        );
      });

    this.#uxDynamicService.updateLogo('done', 2000);
  }
}
