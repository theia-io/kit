import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { followerHandlerFn } from '@kitouch/follow-ui';
import {
  FeatProfileApiActions,
  profilePicture,
  selectCurrentProfile,
  selectFollowingProfiles,
  selectProfileById,
} from '@kitouch/kit-data';
import { APP_PATH } from '@kitouch/shared-constants';
import { Profile } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  FollowButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui-components';
import { select, Store } from '@ngrx/store';
import { MessagesModule } from 'primeng/messages';
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  throwError,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile-following',
  templateUrl: './following.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    //
    MessagesModule,
    //
    UiCompCardComponent,
    FollowButtonComponent,
    AccountTileComponent,
  ],
})
export class PageProfileFollowingComponent {
  #store = inject(Store);
  #activatedRouter = inject(ActivatedRoute);

  #profileId$ = this.#activatedRouter.parent?.parent?.params.pipe(
    map((params) => params['profileId'])
  );

  #profile$ = this.#profileId$
    ? this.#profileId$.pipe(
        switchMap((profileId) =>
          this.#store.select(selectProfileById(profileId))
        ),
        filter(Boolean),
        shareReplay(1)
      )
    : throwError(
        () =>
          'Cannot continue without profile id. likely component is used incorrectly'
      );

  profile = toSignal(this.#profile$);
  profilePic = computed(() => profilePicture(this.profile() ?? {}));

  currentProfile = toSignal(
    this.#store.pipe(select(selectCurrentProfile), filter(Boolean))
  );
  currentProfileFollowingSet = computed(
    () => new Set(this.currentProfile()?.following?.map(({ id }) => id))
  );

  followingProfiles$ = this.#profile$.pipe(
    switchMap((profile) =>
      this.#store.pipe(select(selectFollowingProfiles(profile)))
    ),
    filter((profiles: Array<Profile>) => profiles.length > 0),
    startWith([])
  );

  // followingProfiles$ = combineLatest([
  //   this.#profile$,
  //   this.#store.pipe(select(selectProfiles)),
  // ]).pipe(
  //   map(([profile, profiles]) => {
  //     const followingIds = new Set(profile.following?.map(({ id }) => id) ?? []);
  //     console.log(
  //       'followingIds',
  //       followingIds,
  //       profiles,
  //       profiles.filter((profile) => followingIds.has(profile.id))
  //     );
  //     return profiles.filter((profile) => followingIds.has(profile.id))
  //   }),
  //   filter((profiles) => profiles.length > 0),
  //   take(1)
  // );

  #followerHandlerFn = followerHandlerFn();
  readonly settingsPageUrl = APP_PATH.Settings;
  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  readonly profilePicture = profilePicture;

  constructor() {
    this.#profile$?.pipe(takeUntilDestroyed(), take(1)).subscribe((profile) => {
      this.#store.dispatch(
        FeatProfileApiActions.getProfiles({
          profileIds: profile.following?.map(({ id }) => id) ?? [],
        })
      );
    });
  }

  followProfileHandler(profile: Profile) {
    this.#followerHandlerFn(profile.id, true);
  }

  unFollowProfileHandler(profile: Profile) {
    this.#followerHandlerFn(profile.id, false);
  }
}
