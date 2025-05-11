import { Legal } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatLegalApiActions } from './legal.actions';

export type FeatureLegalState = Array<Legal>;

const featLegalInitialState: FeatureLegalState = [];

export const legalReducer = createReducer(
  featLegalInitialState,
  on(
    FeatLegalApiActions.getCompaniesSuccess,
    (state, { companies }) => companies,
  ),
  on(FeatLegalApiActions.addCompaniesSuccess, (state, { companies }) => [
    ...state,
    ...companies.map(
      (company) =>
        ({
          ...company,
          id: company.alias ?? company.name,
        }) as Legal,
    ),
  ]),
);
