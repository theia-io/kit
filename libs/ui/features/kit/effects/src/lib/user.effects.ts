import { Injectable, inject } from '@angular/core';
import { FeatUserApiActions } from '@kitouch/features/kit/data';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  #actions$ = inject(Actions);
  #userService = inject(UserService);

  addExperience$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.addExperience),
      switchMap(({ experience }) =>
        this.#userService.addUserExperience$(experience).pipe(
          map(({ experiences }) =>
            FeatUserApiActions.addExperienceSuccess({ experiences })
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
}
