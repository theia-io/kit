import { Experience } from '@kitouch/shared/models';
import { createSelector } from '@ngrx/store';
import { FeatureUserState } from './user.reducers';

const selectUserState = (state: { kit: { user: FeatureUserState } }) =>
  state.kit.user;

/** User */
export const selectUser = createSelector(
  selectUserState,
  (state: FeatureUserState) => state.user
);

/** Experience */
export const selectExperiences = createSelector(
  selectUser,
  (user) => user?.experiences
);

export const getExperienceEqualityObject = ({
  title,
  company,
  description,
}: Experience) => ({
  title,
  company,
  description,
});
