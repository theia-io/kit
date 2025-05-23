import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { followerHandlerFn } from '@kitouch/follow-ui';
import {
  profilePicture,
  selectCurrentProfile,
  selectProfileById,
  selectProfileFollowers,
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
import { filter, map, shareReplay, switchMap, throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-profile-followers',
  templateUrl: './followers.component.html',
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
export class PageProfileFollowersComponent {
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

  profileFollowers$ = this.#profile$.pipe(
    switchMap((profile) =>
      this.#store.pipe(
        select(selectProfileFollowers(profile.id)),
        map((profiles) => profiles.filter((profile) => !!profile))
      )
    ),
    filter((profiles) => profiles.length > 0)
  );

  #followerHandlerFn = followerHandlerFn();
  readonly settingsPageUrl = APP_PATH.Settings;
  readonly profileUrlPath = `/${APP_PATH.Profile}/`;
  readonly profilePicture = profilePicture;

  followProfileHandler(profile: Profile) {
    this.#followerHandlerFn(profile.id, true);
  }

  unFollowProfileHandler(profile: Profile) {
    this.#followerHandlerFn(profile.id, false);
  }
}
