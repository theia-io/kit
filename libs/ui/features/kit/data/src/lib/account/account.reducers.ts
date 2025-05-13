import { Account } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatAccountApiActions } from './account.actions';
// import { mongooseEqual } from '@kitouch/shared-utils';

export interface FeatureAccountState {
  account?: Account | null;
}

const featAccountInitialState: FeatureAccountState = {
  account: undefined,
};

export const accountReducer = createReducer(
  featAccountInitialState,
  on(FeatAccountApiActions.setAccount, (state, { account }) => ({
    ...state,
    account,
  }))
);
