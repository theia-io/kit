import { ReTweety, Tweety, TweetyType } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureTweetState } from './tweet.reducers';

/** helper */
export const tweetIsLikedByProfile = (
  tweet: Tweety | ReTweety,
  profileId: string
) => tweet.upProfileIds?.some((upProfileId) => upProfileId === profileId);

export const tweetIsRetweet = (tweety: Tweety | ReTweety): tweety is ReTweety =>
  'referenceProfileId' in tweety;

/** selectors */
export const selectTweetState = (state: {
  tweet: { tweet: FeatureTweetState };
}) => state.tweet.tweet;

export const selectAllTweets = createSelector(
  selectTweetState,
  (state: FeatureTweetState) => state.tweets
);

export const selectTweetsProfile = (
  profileId: string,
  tweets: Array<Tweety | ReTweety>
) =>
  tweets.filter((tweet) =>
    tweet.type === TweetyType.Tweet
      ? tweet.profileId === profileId
      : (tweet as ReTweety).referenceProfileId === profileId
  );

export const selectTweet = (id: string) =>
  createSelector(selectAllTweets, (tweets: Array<Tweety | ReTweety>) =>
    tweets.find((tweet) => tweet.id === id)
  );
