import { ReTweety, Tweety, TweetyType } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureTweetState } from './tweet.reducers';

/** helper */
export const tweetIsLikedByProfile = (tweet: Tweety, profileId: string) =>
  tweet.upProfileIds?.some((upProfileId) => upProfileId === profileId);

export const tweetIsTweet = (tweety: Tweety | ReTweety): tweety is Tweety =>
  tweety.type === TweetyType.Tweet;

export const tweetIsRetweet = (tweety: Tweety | ReTweety): tweety is ReTweety =>
  tweety.type === TweetyType.Retweet;

/** selectors */
export const selectTweetState = (state: {
  tweet: { tweet: FeatureTweetState };
}) => state.tweet.tweet;

export const selectAllTweets = createSelector(
  selectTweetState,
  (state: FeatureTweetState) => state.tweets
);

export const selectTweetsProfileAndRetweets = (
  profileId: string,
  tweets: Array<Tweety | ReTweety>
) =>
  tweets.filter(
    (tweet) =>
      tweet.profileId === profileId ||
      (tweetIsRetweet(tweet) && tweet.retweetedProfileId === profileId)
  );

export const selectTweet = (id: string) =>
  createSelector(selectAllTweets, (tweets: Array<Tweety | ReTweety>) =>
    tweets.find((tweet) => tweet.id === id)
  );
