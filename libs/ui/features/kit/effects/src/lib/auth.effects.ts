import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FeatAccountApiActions,
  FeatProfileApiActions,
  FeatUserApiActions,
} from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { AuthService } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { AuthDataService } from './auth.service';

@Injectable()
export class AuthEffects {
  #router = inject(Router);
  #actions = inject(Actions);
  #authService = inject(AuthService);
  #authDataService = inject(AuthDataService);

  #loggedInWithRealm$ = this.#authService.realmUser$.pipe(
    filter(Boolean),
    switchMap((realmUser) =>
      this.#authDataService.getAccountUserProfiles(realmUser)
    ),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  #profiles$ = this.#loggedInWithRealm$.pipe(
    map(({ profiles }) => profiles),
    filter(Boolean)
  );

  redirectNewUser$ = createEffect(
    () =>
      this.#loggedInWithRealm$.pipe(
        tap(({ account, user, profiles }) => {
          if (!account || !user || !profiles) {
            this.#router.navigateByUrl(`/s/${APP_PATH_STATIC_PAGES.Join}`);
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  deleteUser$ = createEffect(
    () =>
      this.#actions.pipe(
        ofType(FeatAccountApiActions.deleteSuccess),
        tap(() => this.#authService.deleteRealmUser())
      ),
    { dispatch: false }
  );

  setAccount$ = createEffect(() =>
    this.#loggedInWithRealm$.pipe(
      map(({ account }) => account),
      filter(Boolean),
      map((account) => FeatAccountApiActions.setAccount({ account }))
    )
  );

  setUser$ = createEffect(() =>
    this.#loggedInWithRealm$.pipe(
      map(({ user }) => user),
      filter(Boolean),
      map((user) => FeatUserApiActions.setUser({ user }))
    )
  );

  setCurrentProfile$ = createEffect(() =>
    this.#profiles$.pipe(
      map((profiles) => {
        const currentProfile = profiles?.[0];

        if (!currentProfile) {
          const err = 'Major error, we are working on it';
          console.error(err);
          return FeatProfileApiActions.setCurrentProfileError({ message: err });
        }

        return FeatProfileApiActions.setCurrentProfile({
          profile: currentProfile,
        });
      })
    )
  );

  setProfiles$ = createEffect(() =>
    this.#profiles$.pipe(
      map((profiles) =>
        FeatProfileApiActions.setProfiles({
          profiles,
        })
      )
    )
  );

  getFollowingProfiles$ = createEffect(() =>
    this.#actions.pipe(
      ofType(FeatProfileApiActions.setCurrentProfile),
      map(({ profile }) => profile.following?.map((id) => id)),
      filter(
        (
          followingProfilesIds
        ): followingProfilesIds is {
          id: Profile['id'];
        }[] => !!followingProfilesIds && followingProfilesIds.length > 0
      ),
      map((followingProfilesIds) => {
        return FeatProfileApiActions.getProfiles({
          profileIds: followingProfilesIds.map(({ id }) => id),
        });
      })
    )
  );
}
