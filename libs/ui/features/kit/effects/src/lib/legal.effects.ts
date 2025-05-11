import { Injectable, inject } from '@angular/core';
import {
  FeatLegalApiActions,
  FeatUserApiActions,
  getMatchingCompanies,
} from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LegalService } from './legal.service';

@Injectable()
export class LegalEffects {
  #store$ = inject(Store);
  #actions$ = inject(Actions);
  #legalService = inject(LegalService);

  companies$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatLegalApiActions.getCompanies),
      switchMap(() =>
        this.#legalService.getCompanies$().pipe(
          map((companies) =>
            FeatLegalApiActions.getCompaniesSuccess({ companies }),
          ),
          catchError((err) => {
            console.error('[LegalEffects] companies', err);
            return of(
              FeatLegalApiActions.getCompaniesFailure({
                message: 'Cannot get companies now',
              }),
            );
          }),
        ),
      ),
    ),
  );

  /** @TODO @FIXME this eventually has to migrate to BE */
  addCompanyThroughExperience$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatUserApiActions.addExperience),
      filter(({ experience }) => experience.company?.length > 2),
      switchMap(({ experience }) =>
        this.#store$.select(getMatchingCompanies(experience.company)).pipe(
          filter((v) => !v.length), // has NOT to find anything existing
          map(() => experience.company),
        ),
      ),
      map((company) =>
        FeatLegalApiActions.addCompanies({
          companies: [{ name: company, alias: company }],
        }),
      ),
    ),
  );

  addCompanies$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatLegalApiActions.addCompanies),
      switchMap(({ companies }) =>
        this.#legalService.addCompanies$(companies).pipe(
          /**  @TODO @FIXME this wont have full company info. fix once migrated to BE */
          map(() => FeatLegalApiActions.addCompaniesSuccess({ companies })),
          catchError((err) => {
            console.error('[[LegalEffects] addCompanies', err);
            return of(
              FeatLegalApiActions.addCompaniesFailure({
                message: 'Cannot insert new companies now',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
