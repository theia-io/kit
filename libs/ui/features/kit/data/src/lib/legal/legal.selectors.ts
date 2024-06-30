import { createSelector } from '@ngrx/store';
import { FeatureLegalState } from './legal.reducers';

const selectLegalState = (state: { kit: { companies: FeatureLegalState } }) =>
  state.kit?.companies;

/** Profiles */
export const selectCompaniesState = createSelector(
  selectLegalState,
  (companies: FeatureLegalState) => companies
);
