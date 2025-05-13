import { Injectable, inject } from '@angular/core';
import { FeatUserApiActions } from '@kitouch/kit-data';

import { Auth0Service } from '@kitouch/shared-infra';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { UserV2Service } from './userv2.service';

@Injectable()
export class UserEffects {
  #actions$ = inject(Actions);
  #userV2Service = inject(UserV2Service);
  #auth0Service = inject(Auth0Service);

  currentUser$ = this.#auth0Service.loggedInUser$.pipe(filter(Boolean));

  getUser$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.getUser),
      switchMap(({ userId }) =>
        this.#userV2Service.getUser$(userId).pipe(
          map((user) =>
            user
              ? FeatUserApiActions.getUserSuccess({
                  user,
                })
              : FeatUserApiActions.getUserFailure({
                  message: 'No such user',
                })
          ),
          catchError((err) => {
            console.error('[UserEffects] getUser', err);
            return of(
              FeatUserApiActions.getUserFailure({
                message: 'It is not you, its us. Cannot get user now.',
              })
            );
          })
        )
      )
    )
  );

  addExperience$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.addExperience),
      withLatestFrom(this.currentUser$),
      switchMap(([{ experience }, currentUser]) =>
        this.#userV2Service.addUserExperience$(currentUser.id, experience).pipe(
          map(() =>
            FeatUserApiActions.addExperienceSuccess({
              experience,
            })
          ),
          catchError((err) => {
            console.error('[UserEffects] addExperience', err);
            return of(
              FeatUserApiActions.addExperienceFailure({
                message: 'Cannot add experience now',
              })
            );
          })
        )
      )
    )
  );

  deleteExperience$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.deleteExperience),
      withLatestFrom(this.currentUser$),
      switchMap(([{ experience }, currentUser]) =>
        this.#userV2Service
          .deleteUserExperience$(currentUser.id, experience.id)
          .pipe(
            map(() =>
              FeatUserApiActions.deleteExperienceSuccess({ experience })
            ),
            catchError((err) => {
              console.error('[UserEffects] deleteExperience', err);
              return of(
                FeatUserApiActions.deleteExperienceFailure({
                  message: 'Cannot delete experience now',
                })
              );
            })
          )
      )
    )
  );
}
