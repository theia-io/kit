import { createSelector } from '@ngrx/store';
import { FeatureUserState } from './user.reducers';

const selectUserState = (state: { kit: { user: FeatureUserState } }) =>
  state.kit.user;

/** User */
export const selectUser = createSelector(
  selectUserState,
  (state: FeatureUserState) => state.user
);