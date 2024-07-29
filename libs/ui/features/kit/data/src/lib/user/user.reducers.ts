import { User } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatUserApiActions } from './user.actions';
import _ from 'lodash';
import { getExperienceEqualityObject } from './user.selectors';
// import { mongooseEqual } from '@kitouch/shared/utils';

export interface FeatureUserState {
  user?: User;
}

const featUserInitialState: FeatureUserState = {
  user: undefined,
};

export const userReducer = createReducer(
  featUserInitialState,
  on(FeatUserApiActions.setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(FeatUserApiActions.addExperienceSuccess, (state, { experiences }) => ({
    ...state,
    user: {
      ...(state.user ?? {}),
      experiences,
    } as any,
  })),
  on(FeatUserApiActions.deleteExperienceSuccess, (state, { experience }) => ({
    ...state,
    user: {
      ...(state.user ?? {}),
      experiences:
        state.user?.experiences?.filter((userExperience) =>
          !_.isEqual(
            getExperienceEqualityObject(userExperience),
            getExperienceEqualityObject(experience)
          )
        ) ?? [],
    } as any,
  }))
);
