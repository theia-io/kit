import { Experience } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureUserState } from './user.reducers';

/** utils */
export const getExperienceEqualityObject = ({
  title,
  company,
  description,
}: Experience) => ({
  title,
  company,
  description,
});

/** selectors */

const selectUserState = (state: { kit: { user: FeatureUserState } }) =>
  state.kit.user;

/** User */
export const selectCurrentUser = createSelector(
  selectUserState,
  (state: FeatureUserState) => state.user
);

export const getUserById = (userId: string) =>
  createSelector(selectUserState, ({ users }) =>
    users.find((user) => user.id === userId)
  );

/** Experience */
export const selectCurrentUserExperiences = createSelector(
  selectCurrentUser,
  (currentUser) => currentUser?.experiences
);

export const selectUserExperience = (userId: string) =>
  createSelector(getUserById(userId), (user) => user?.experiences);
