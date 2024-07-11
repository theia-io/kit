import { createSelector } from '@ngrx/store';
import { FeatureLegalState } from './legal.reducers';

const selectLegalState = (state: { kit: { companies: FeatureLegalState } }) =>
  state.kit?.companies;

/** Profiles */
export const selectCompaniesState = createSelector(
  selectLegalState,
  (companies: FeatureLegalState) => companies
);

/** Helpers */
export const getMatchingCompanies = (companyName: string) =>
  createSelector(selectLegalState, (companies: FeatureLegalState) =>
    companies
      .filter(
        ({ alias, name }) =>
          alias.includes(companyName) || name.includes(companyName)
      )
      .splice(-10)
      .map(({ alias, name }) => alias ?? name ?? '')
  );
