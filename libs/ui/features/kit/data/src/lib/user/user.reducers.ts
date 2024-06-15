import { User } from '@kitouch/shared/models';
import { createReducer, on } from '@ngrx/store';
import {
  FeatUserApiActions
} from './user.actions';
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
  }))
);
