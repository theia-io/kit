import { AsyncPipe } from '@angular/common';
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
import { APP_PATH } from '@kitouch/shared-constants';
import { Device, DeviceService } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { UXDynamicService } from '@kitouch/shared-services';
import { Store } from '@ngrx/store';
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
    //
    TabMenuModule,
    ButtonModule,
    //
    FeatKitProfileHeaderComponent,
    FeatFollowUnfollowProfileComponent,
  ],
})
export class PageProfileComponent {
  readonly settingsUrl = `/${APP_PATH.Settings}`;

  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);
  #uxDynamicService = inject(UXDynamicService);
  #deviceService = inject(DeviceService);

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

  tabMenuItems$ = this.#deviceService.device$.pipe(
    map((device) =>
      device === Device.Mobile
        ? [
            { label: '', icon: 'pi pi-inbox', routerLink: 'tweets' },
            { label: '', icon: 'pi pi-briefcase', routerLink: 'experience' },
            { label: '', icon: 'pi pi-users', routerLink: 'following' },
          ]
        : [
            { label: 'Tweets', icon: 'pi pi-inbox', routerLink: 'tweets' },
            {
              label: 'Experience',
              icon: 'pi pi-briefcase',
              routerLink: 'experience',
            },
            {
              label: 'Following',
              icon: 'pi pi-users',
              routerLink: 'following',
            },
          ]
    )
  );

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
