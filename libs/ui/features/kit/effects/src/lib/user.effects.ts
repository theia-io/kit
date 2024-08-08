import { Injectable, inject } from '@angular/core';
import { FeatUserApiActions } from '@kitouch/kit-data';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  #actions$ = inject(Actions);
  #userService = inject(UserService);

  // getUser$ = createEffect(() =>
  //   this.#actions$.pipe(
  //     ofType(FeatUserApiActions.getUser),
  //     switchMap(({ userId }) =>
  //       this.#userService.getUser$(userId).pipe(
  //         map((user) =>
  //           user
  //             ? FeatUserApiActions.getUserSuccess({
  //                 user,
  //               })
  //             : FeatUserApiActions.getUserFailure({
  //                 message: 'No such user',
  //               })
  //         ),
  //         catchError((err) => {
  //           console.error('[UserEffects] getUser', err);
  //           return of(
  //             FeatUserApiActions.getUserFailure({
  //               message: 'It is not you, its us. Cannot get user now.',
  //             })
  //           );
  //         })
  //       )
  //     )
  //   )
  // );

  addExperience$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.addExperience),
      switchMap(({ experience }) =>
        this.#userService.addUserExperience$(experience).pipe(
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
      switchMap(({ experience }) =>
        this.#userService.deleteUserExperience$(experience).pipe(
          map(({ experience }) =>
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
