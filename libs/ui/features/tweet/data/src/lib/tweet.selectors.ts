import { createSelector } from '@ngrx/store';
import { FeatureTweetState } from './tweet.reducers';

export const selectTweetState = (state: { tweet: FeatureTweetState }) =>
  state.tweet;

export const selectAllTweets = createSelector(
  selectTweetState,
  (state: FeatureTweetState) => state.tweets
);
