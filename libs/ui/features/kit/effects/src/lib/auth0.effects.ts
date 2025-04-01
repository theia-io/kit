import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FeatAccountApiActions,
  FeatAuth0Events,
  FeatProfileApiActions,
  FeatUserApiActions,
} from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Auth0Service } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class Auth0Effects {
  #router = inject(Router);
  #actions = inject(Actions);
  #auth0Service = inject(Auth0Service);

  handleAuthRedirect = createEffect(() =>
    this.#actions.pipe(
      ofType(FeatAuth0Events.handleRedirect),
      switchMap(() =>
        this.#auth0Service.getCurrentSessionAccountUserProfiles().pipe(
          map(({ user, account, profiles }) =>
            FeatAuth0Events.handleRedirectSuccess({ user, account, profiles })
          ),
          catchError(() => of(FeatAuth0Events.handleRedirectFailure()))
        )
      )
    )
  );

  postAuthRedirectActions = createEffect(
    () =>
      merge(
        this.#actions.pipe(
          ofType(FeatAuth0Events.handleRedirectSuccess),
          tap(() =>
            this.#router.navigateByUrl(
              this.#auth0Service.postSignInUrl() ?? '/'
            )
          )
        ),
        this.#actions.pipe(
          ofType(FeatAuth0Events.handleRedirectFailure),
          tap(() =>
            this.#router.navigateByUrl(`/s/${APP_PATH_STATIC_PAGES.SignIn}`)
          )
        )
      ),
    {
      dispatch: false,
    }
  );

  #accountUserProfiles$ = this.#actions.pipe(
    ofType(FeatAuth0Events.handleRedirectSuccess),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  redirectNewUser$ = this.#accountUserProfiles$.pipe(
    tap(({ account, user, profiles }) => {
      if (!account || !user || !profiles) {
        this.#router.navigateByUrl(`/s/${APP_PATH_STATIC_PAGES.Join}`);
      }
    })
  );

  setAccount$ = createEffect(() =>
    this.#accountUserProfiles$.pipe(
      map(({ account }) => account),
      filter(Boolean),
      map((account) => FeatAccountApiActions.setAccount({ account }))
    )
  );

  setUser$ = createEffect(() =>
    this.#accountUserProfiles$.pipe(
      map(({ user }) => user),
      filter(Boolean),
      map((user) => FeatUserApiActions.setUser({ user }))
    )
  );

  setCurrentProfile$ = createEffect(() =>
    this.#accountUserProfiles$.pipe(
      map(({ profiles }) => profiles),
      filter(Boolean),
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

  setProfiles$ = createEffect(() =>
    this.#accountUserProfiles$.pipe(
      map(({ profiles }) => profiles),
      filter(Boolean),
      map((profiles) =>
        FeatProfileApiActions.setProfiles({
          profiles,
        })
      )
    )
  );

  deleteUser$ = createEffect(
    () =>
      this.#actions.pipe(
        ofType(FeatAccountApiActions.deleteSuccess),
        tap(() => this.#auth0Service.deleteAuth0User())
      ),
    { dispatch: false }
  );
}
