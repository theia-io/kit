import { createSelector } from '@ngrx/store';
import { FeatureAccountState } from './account.reducers';

const selectAccountState = (state: { kit: { account: FeatureAccountState } }) =>
  state.kit.account;

/** Accounts */
export const selectAccount = createSelector(
  selectAccountState,
  (state: FeatureAccountState) => state.account
);
