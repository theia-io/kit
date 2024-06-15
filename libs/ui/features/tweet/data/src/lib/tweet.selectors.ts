import { createSelector } from '@ngrx/store';
import { FeatureTweetState } from './tweet.reducers';
import { Tweety } from '@kitouch/shared/models';

export const selectTweetState = (state: { tweet: FeatureTweetState }) =>
  state.tweet;

export const selectAllTweets = createSelector(
  selectTweetState,
  (state: FeatureTweetState) => state.tweets
);

export const selectTweetsProfile = (profileId: string) =>
  createSelector(selectAllTweets, (tweets: Tweety[]) =>
    tweets.filter(tweet => tweet.profileId === profileId)
  )

export const selectTweet = (id: string) =>
  createSelector(selectAllTweets, (tweets: Tweety[]) =>
    tweets.find(tweet => tweet.id === id)
  )