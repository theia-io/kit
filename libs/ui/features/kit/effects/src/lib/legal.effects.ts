import { Injectable, inject } from '@angular/core';
import {
    FeatLegalApiActions
} from '@kitouch/features/kit/data';
import { DataSourceService } from '@kitouch/ui/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class LegalEffects {
  #actions$ = inject(Actions);
  #dataSource = inject(DataSourceService);

  companies$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatLegalApiActions.getCompanies),
      switchMap(() =>
        this.#dataSource.getCompanies$().pipe(
          map((companies) =>
            FeatLegalApiActions.getCompaniesSuccess({ companies })
          ),
          catchError((err) => {
            console.error('[LegalEffects] companies', err);
            return of(
              FeatLegalApiActions.getCompaniesFailure({
                message: 'Cannot get companies now',
              })
            );
          })
        )
      )
    )
  );
}
