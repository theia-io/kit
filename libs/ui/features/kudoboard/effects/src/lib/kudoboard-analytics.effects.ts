import { Injectable, inject } from '@angular/core';

import {
  FeatKudoBoardActions,
  FeatKudoBoardAnalyticsActions,
} from '@kitouch/data-kudoboard';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { KudoBoardAnalyticsV2Service } from './kudoboard-analyticsV2.service';

@Injectable()
export class KudoBoardAnalyticsEffects {
  #actions$ = inject(Actions);

  #kudoboardAnalyticsService = inject(KudoBoardAnalyticsV2Service);

  newAnalyticsKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardAnalyticsActions.postAnalyticsKudoBoard),
      switchMap(({ analytics }) =>
        this.#kudoboardAnalyticsService.createAnalyticsKudoBoard(analytics)
      ),
      map((analytics) =>
        analytics
          ? FeatKudoBoardAnalyticsActions.postAnalyticsKudoBoardSuccess({
              analytics,
            })
          : FeatKudoBoardAnalyticsActions.postAnalyticsKudoBoardFailure({
              message:
                'We were not able to create kudoboard analytics. Let us know so we can get it fixed for you. Otherwise no analytics will be available for created kudoboard.',
            })
      )
    )
  );

  deleteKudoBoardAnalytics$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.deleteKudoBoardSuccess),
      switchMap(({ id }) =>
        this.#kudoboardAnalyticsService.deleteAnalyticsKudoBoard(id).pipe(
          map((deleted) =>
            deleted
              ? FeatKudoBoardAnalyticsActions.deleteAnalyticsKudoBoardSuccess({
                  id,
                })
              : FeatKudoBoardAnalyticsActions.deleteAnalyticsKudoBoardFailure({
                  message:
                    'KudoBoard analytics were not deleted. Reach out to support.',
                })
          ),
          catchError((err) =>
            of(
              FeatKudoBoardAnalyticsActions.deleteAnalyticsKudoBoardFailure({
                message: `Network issue, did not delete kudoboard analytics. Reach out to support ${err.message}.`,
              })
            )
          )
        )
      )
    )
  );

  getAnalyticsKudoBoards$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardActions.getKudoBoardsSuccess),
      filter(({ kudoboards }) => kudoboards.length > 0),
      switchMap(({ kudoboards }) =>
        this.#kudoboardAnalyticsService.getAnalyticsKudoBoards(
          kudoboards.map(({ id }) => id)
        )
      ),
      map((analytics) =>
        FeatKudoBoardAnalyticsActions.getAllAnalyticsSuccess({ analytics })
      )
    )
  );

  getAnalyticsKudoBoard$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardAnalyticsActions.getAnalyticsKudoBoard),
      switchMap(({ kudoBoardId }) =>
        this.#kudoboardAnalyticsService.getAnalyticsKudoBoard(kudoBoardId)
      ),
      map((analytics) =>
        analytics
          ? FeatKudoBoardAnalyticsActions.getAnalyticsKudoBoardSuccess({
              analytics,
            })
          : FeatKudoBoardAnalyticsActions.getAnalyticsKudoBoardFailure({
              message: 'Analytics for this kudoboard was not find',
            })
      )
    )
  );
}
