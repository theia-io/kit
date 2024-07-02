import { Injectable, inject } from '@angular/core';
import { FeatLegalApiActions } from '@kitouch/features/kit/data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LegalService } from './legal.service';

@Injectable()
export class LegalEffects {
  #actions$ = inject(Actions);
  #legalService = inject(LegalService);

  companies$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatLegalApiActions.getCompanies),
      switchMap(() =>
        this.#legalService.getCompanies$().pipe(
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
