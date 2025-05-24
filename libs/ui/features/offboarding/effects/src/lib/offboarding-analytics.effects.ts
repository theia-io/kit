import { Injectable, inject } from '@angular/core';

import {
  FeatExpOffboardingActions,
  FeatExpOffboardingAnalyticsActions,
} from '@kitouch/feat-offboarding-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ExpOffboardingAnalyticsV2Service } from './offboarding-analyticsV2.service';

@Injectable()
export class OffboardingAnalyticsEffects {
  #actions$ = inject(Actions);

  #offBoardingAnalyticsService = inject(ExpOffboardingAnalyticsV2Service);

  newAnalyticsExpOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingAnalyticsActions.postAnalyticsExpOffboarding),
      switchMap(({ analytics }) =>
        this.#offBoardingAnalyticsService.createAnalyticsOffboarding(analytics)
      ),
      map((analytics) =>
        analytics
          ? FeatExpOffboardingAnalyticsActions.postAnalyticsExpOffboardingSuccess(
              {
                analytics,
              }
            )
          : FeatExpOffboardingAnalyticsActions.postAnalyticsExpOffboardingFailure(
              {
                message:
                  'We were not able to create offBoarding analytics. Let us know so we can get it fixed for you. Otherwise no analytics will be available for created offBoarding.',
              }
            )
      )
    )
  );

  deleteOffboardingAnalytics$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.deleteExpOffboardingSuccess),
      switchMap(({ id }) =>
        this.#offBoardingAnalyticsService.deleteAnalyticsOffboarding(id).pipe(
          map((deleted) =>
            deleted
              ? FeatExpOffboardingAnalyticsActions.deleteAnalyticsExpOffboardingSuccess(
                  {
                    id,
                  }
                )
              : FeatExpOffboardingAnalyticsActions.deleteAnalyticsExpOffboardingFailure(
                  {
                    message:
                      'Offboarding analytics were not deleted. Reach out to support.',
                  }
                )
          ),
          catchError((err) =>
            of(
              FeatExpOffboardingAnalyticsActions.deleteAnalyticsExpOffboardingFailure(
                {
                  message: `Network issue, did not delete offBoarding analytics. Reach out to support ${err.message}.`,
                }
              )
            )
          )
        )
      )
    )
  );

  getAnalyticsExpOffboardings$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingActions.getExpOffboardingsSuccess),
      filter(({ offboardings }) => offboardings.length > 0),
      switchMap(({ offboardings }) =>
        this.#offBoardingAnalyticsService.getAnalyticsOffboardings(
          offboardings.map(({ id }) => id)
        )
      ),
      map((analytics) =>
        FeatExpOffboardingAnalyticsActions.getAllAnalyticsSuccess({ analytics })
      )
    )
  );

  getAnalyticsExpOffboarding$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatExpOffboardingAnalyticsActions.getAnalyticsExpOffboarding),
      switchMap(({ offboardingId }) =>
        this.#offBoardingAnalyticsService.getAnalyticsOffboarding(offboardingId)
      ),
      map((analytics) =>
        analytics
          ? FeatExpOffboardingAnalyticsActions.getAnalyticsExpOffboardingSuccess(
              {
                analytics,
              }
            )
          : FeatExpOffboardingAnalyticsActions.getAnalyticsExpOffboardingFailure(
              {
                message: 'Analytics for this offBoarding was not find',
              }
            )
      )
    )
  );
}
