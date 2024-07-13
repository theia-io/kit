import { createSelector } from '@ngrx/store';
import { FeatureFollowState } from './follow.reducers';

/** selectors */
const selectFollowState = (state: { follow: FeatureFollowState }) =>
  state.follow;

export const selectColleaguesProfilesSuggestions = createSelector(
  selectFollowState,
  (state) => state.colleaguesProfiles
);
