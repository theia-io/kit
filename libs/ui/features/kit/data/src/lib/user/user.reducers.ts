import { User } from '@kitouch/shared-models';
import { addOrUpdate } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import _ from 'lodash';
import { FeatUserApiActions } from './user.actions';
import { getExperienceEqualityObject } from './user.selectors';
// import { mongooseEqual } from '@kitouch/shared-utils';

export interface FeatureUserState {
  user?: User | null;
  users: Array<User>;
}

const featUserInitialState: FeatureUserState = {
  user: undefined,
  users: [],
};

export const userReducer = createReducer(
  featUserInitialState,
  on(FeatUserApiActions.setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(FeatUserApiActions.addExperienceSuccess, (state, { experience }) => ({
    ...state,
    user: state.user
      ? {
          ...state.user,
          experiences: [experience, ...(state.user?.experiences ?? [])],
        }
      : undefined,
  })),
  on(FeatUserApiActions.deleteExperienceSuccess, (state, { experience }) => ({
    ...state,
    user: state.user
      ? {
          ...(state.user ?? {}),
          experiences:
            state.user?.experiences?.filter(
              (userExperience) =>
                !_.isEqual(
                  getExperienceEqualityObject(userExperience),
                  getExperienceEqualityObject(experience),
                ),
            ) ?? [],
        }
      : undefined,
  })),
  on(FeatUserApiActions.getUserSuccess, (state, { user }) => ({
    ...state,
    users: addOrUpdate(user, state.users),
  })),
);
