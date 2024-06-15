import { createSelector } from '@ngrx/store';
import { FeatureUserState } from './user.reducers';

const selectUserState = (state: { user: FeatureUserState }) =>
  state.user;

/** User */
export const selectUser = createSelector(
  selectUserState,
  (state: FeatureUserState) => state.user
);
