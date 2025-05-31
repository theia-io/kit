import { inject, Injectable } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';

import { FeatExpOffboardingActions } from '@kitouch/feat-offboarding-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { OffboardingV2Service } from './offboarding.service';

@Injectable()
export class OffboardingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  #offboardingService = inject(OffboardingV2Service);

  #currentProfile = this.#store.pipe(select(selectCurrentProfile));

  getExpOffboardings$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.getProfileExpOffboardings),
      switchMap(({ profileId }) =>
        this.#offboardingService.getOffboardings(profileId)
      ),
      map((offboardings) =>
        FeatExpOffboardingActions.getExpOffboardingsSuccess({ offboardings })
      )
    )
  );

  getExpOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.getExpOffboarding),
      switchMap(({ id }) =>
        this.#offboardingService.getOffboarding(id).pipe(
          map((offboarding) =>
            offboarding
              ? FeatExpOffboardingActions.getExpOffboardingSuccess({
                  offboarding,
                })
              : FeatExpOffboardingActions.getExpOffboardingFailure({
                  id,
                  message: 'Did not find this offboarding.',
                })
          ),
          catchError((err) =>
            of(
              FeatExpOffboardingActions.getExpOffboardingFailure({
                id,
                message: `There has been an error. It is us. Try later, ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  createOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.createExpOffboarding),
      withLatestFrom(this.#currentProfile.pipe(filter(Boolean))),
      switchMap(([{ offboarding }, profile]) =>
        this.#offboardingService.createOffboarding({
          ...offboarding,
          profileId: profile.id,
          profile,
          farewellIds: [],
          kudoboardIds: [],
          profileIdsNetwork: [],
        })
      ),
      map((offboarding) =>
        FeatExpOffboardingActions.createExpOffboardingSuccess({ offboarding })
      )
    )
  );

  putOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.putExpOffboarding),
      switchMap(({ offboarding }) =>
        this.#offboardingService.putOffboarding(offboarding).pipe(
          map((offboarding) =>
            FeatExpOffboardingActions.putExpOffboardingSuccess({ offboarding })
          ),
          catchError((err) =>
            of(
              FeatExpOffboardingActions.putExpOffboardingFailure({
                message: `Failed to update offboarding. Try again later or contact support. ${err.message}`,
              })
            )
          )
        )
      )
    )
  );

  deleteOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.deleteExpOffboarding),
      switchMap(({ id }) =>
        this.#offboardingService.deleteOffboarding(id).pipe(
          map((deleted) =>
            deleted
              ? FeatExpOffboardingActions.deleteExpOffboardingSuccess({ id })
              : FeatExpOffboardingActions.deleteExpOffboardingFailure({
                  message:
                    'It seems this offboarding cannot be deleted. Please, get in touch with us.',
                })
          ),
          catchError(() =>
            of(
              FeatExpOffboardingActions.deleteExpOffboardingFailure({
                message:
                  'We were unable to delete offboarding. It is not you, its us. Try again later or contact us directly',
              })
            )
          )
        )
      )
    )
  );
}
