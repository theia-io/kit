import { Tweety } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureTweetState } from './tweet.reducers';

/** helper */
export const tweetIsLikedByProfile = (tweet: Tweety, profileId: string) =>
  tweet.upProfileIds?.some((upProfileId) => upProfileId === profileId);

/** selectors */
export const selectTweetState = (state: {
  tweet: { tweet: FeatureTweetState };
}) => state.tweet.tweet;

export const selectAllTweets = createSelector(
  selectTweetState,
  (state: FeatureTweetState) => state.tweets
);

export const selectTweetsProfile = (profileId: string) =>
  createSelector(selectAllTweets, (tweets: Tweety[]) =>
    tweets.filter((tweet) => tweet.profileId === profileId)
  );

export const selectTweet = (id: string) =>
  createSelector(selectAllTweets, (tweets: Tweety[]) =>
    tweets.find((tweet) => tweet.id === id)
  );
