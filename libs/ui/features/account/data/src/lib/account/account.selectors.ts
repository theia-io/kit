import { createSelector } from '@ngrx/store';
import { FeatureAccountState } from './account.reducers';

const selectAccountState = (state: { account: FeatureAccountState }) =>
  state.account;

/** Accounts */
export const selectAccount = createSelector(
  selectAccountState,
  (state: FeatureAccountState) => state.account
);
