import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FeatAccountApiActions,
  FeatAccountEvents,
  FeatProfileApiActions,
  FeatUserApiActions,
} from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs';
import { Auth0DataService } from './auth0.service';

@Injectable()
export class Auth0Effects {
  #router = inject(Router);
  #actions = inject(Actions);
  #auth0Service = inject(Auth0Service);
  #auth0DataService = inject(Auth0DataService);

  handleAuthRedirect = createEffect(
    () =>
      this.#actions.pipe(
        ofType(FeatAccountEvents.handleRedirect),
        tap(() => this.#auth0Service.handleSignInRedirect())
      ),
    {
      dispatch: false,
    }
  );

  #resolvedAccountUserProfiles$ = this.#auth0Service.auth0User$$.pipe(
    filter(Boolean),
    switchMap((user) => this.#auth0DataService.getAccountUserProfiles(user))
  );

  #profiles$ = this.#resolvedAccountUserProfiles$.pipe(
    map(({ profiles }) => profiles),
    filter(Boolean)
  );

  redirectNewUser$ = createEffect(
    () =>
      this.#resolvedAccountUserProfiles$.pipe(
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
        tap(() => this.#auth0Service.deleteAuth0User())
      ),
    { dispatch: false }
  );

  setAccount$ = createEffect(() =>
    this.#resolvedAccountUserProfiles$.pipe(
      map(({ account }) => account),
      filter(Boolean),
      map((account) => FeatAccountApiActions.setAccount({ account }))
    )
  );

  setUser$ = createEffect(() =>
    this.#resolvedAccountUserProfiles$.pipe(
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
