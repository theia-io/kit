import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeatKitProfileHeaderComponent } from '@kitouch/feat-kit-ui';
import { FeatFollowUnfollowProfileComponent } from '@kitouch/follow-ui';
import {
  FeatProfileApiActions,
  selectCurrentProfile,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { Profile } from '@kitouch/shared-models';
import {
  Device,
  DeviceService,
  UXDynamicService,
} from '@kitouch/shared-services';
import { select, Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import {
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';

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
  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);
  #uxDynamicService = inject(UXDynamicService);
  #deviceService = inject(DeviceService);

  #profileId$ = this.#activatedRouter.params.pipe(
    map((params) => params['profileId']),
    shareReplay(1)
  );

  #profile$ = this.#profileId$.pipe(
    switchMap((profileId) =>
      this.#store.pipe(select(selectProfileById(profileId)))
    ),
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
            { label: '', icon: 'pi pi-inbox', routerLink: 'activity' },
            { label: '', icon: 'pi pi-briefcase', routerLink: 'experience' },
            { label: '', icon: 'pi pi-users', routerLink: 'following' },
          ]
        : [
            { label: 'Activity', icon: 'pi pi-inbox', routerLink: 'activity' },
            {
              label: 'Experience',
              icon: 'pi pi-briefcase',
              routerLink: 'experience',
            },
            {
              label: 'Connections',
              icon: 'pi pi-users',
              routerLink: 'connections',
            },
          ]
    )
  );

  readonly settingsUrl = `/${APP_PATH.Settings}`;

  constructor() {
    combineLatest([this.#profileId$, this.#profile$])
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(([profileId, profile]) => {
        if (!profile) {
          this.#store.dispatch(
            FeatProfileApiActions.getProfiles({ profileIds: [profileId] })
          );
        }
      });

    this.#profileId$
      ?.pipe(takeUntilDestroyed(), take(1))
      .subscribe((profileId) => {
        this.#store.dispatch(
          FeatProfileApiActions.getProfileFollowers({ profileId })
        );
      });
  }

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
