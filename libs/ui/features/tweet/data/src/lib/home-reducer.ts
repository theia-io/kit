import { createReducer, on } from '@ngrx/store';
import { HomeTweetActions } from './home-actions';
import { PageHomeState } from './home-selector';

export const initialState: PageHomeState = {
  tweets: [],
};

export const pageHomeReducer = createReducer(
  initialState,
  on(HomeTweetActions.setAll, (state, { tweets }) => ({
    ...state,
    tweets,
  }))
);
