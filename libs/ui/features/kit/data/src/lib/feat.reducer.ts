import { combineReducers } from '@ngrx/store';
import {
  FeatureAccountState,
  accountReducer,
} from './account/account.reducers';
import { legalReducer } from './legal/legal.reducers';
import {
  FeatureProfileState,
  profileReducer,
} from './profile/profile.reducers';
import { FeatureUserState, userReducer } from './user/user.reducers';

export interface AccountState {
  account?: FeatureAccountState;
  profile: FeatureProfileState;
  user: FeatureUserState;
}

export const featReducer = combineReducers({
  account: accountReducer,
  profile: profileReducer,
  user: userReducer,
  companies: legalReducer,
});
