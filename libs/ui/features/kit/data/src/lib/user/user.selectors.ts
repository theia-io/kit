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

/**
 * (selectCurrentUser) user should not be used anyone & anything but by
 * `Auth0Service.loggedInUser$`;
 *
 * Note!
 * All other usages are incorrect and should be avoided.
 * When you need user:
 * 1. #auth0Service = inject(Auth0Service)
 * 2. and use `#auth0Service.loggedInUser$`
 **/
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
