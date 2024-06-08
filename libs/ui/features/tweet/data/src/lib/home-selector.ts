import { Tweety } from '@kitouch/shared/models';
import { createSelector } from '@ngrx/store';

export interface PageHomeState {
  tweets: Tweety[];
}

export const selectPageHomeState = (state: { home: PageHomeState }) =>
  state.home;

export const selectHomeTweets = createSelector(
  selectPageHomeState,
  (state: PageHomeState) => state.tweets
);
