import { ReTweety, Tweety, TweetyType } from '@kitouch/shared-models';
import { addOrUpdate, mergeArr } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import {
  FeatReTweetActions,
  FeatTweetActions,
  TweetApiActions,
} from './tweet.actions';

export interface FeatureTweetState {
  tweets: Array<Tweety | ReTweety>;
  nextCursor: string | null;
  hasNextPage: boolean | null;
}

const featTweetInitialState: FeatureTweetState = {
  tweets: [],
  nextCursor: null,
  hasNextPage: null,
};

export const featTweetTweetsReducer = createReducer(
  featTweetInitialState,
  on(
    TweetApiActions.getSuccess,
    FeatTweetActions.likeSuccess,
    FeatTweetActions.commentSuccess,
    FeatReTweetActions.reTweetSuccess,
    FeatTweetActions.tweetSuccess,
    ({ tweets: stateTweets, ...restState }, { tweet }) => ({
      ...restState,
      tweets: addOrUpdate(tweet, stateTweets),
    })
  ),
  on(
    TweetApiActions.getAll,
    TweetApiActions.getTweetsForProfile,
    (state, { hasNextPage, nextCursor }) => ({
      ...state,
      hasNextPage: hasNextPage,
      nextCursor: nextCursor,
    })
  ),
  on(
    TweetApiActions.getAllSuccess,
    TweetApiActions.getTweetsForProfileSuccess,
    (state, { tweets, hasNextPage, nextCursor }) => ({
      ...state,
      tweets: mergeArr(tweets, state.tweets),
      hasNextPage,
      nextCursor,
    })
  ),
  on(TweetApiActions.getTweetsForBookmarkSuccess, (state, { tweets }) => ({
    ...state,
    tweets: mergeArr(tweets, state.tweets),
  })),
  on(FeatTweetActions.deleteSuccess, (state, { tweet: { id } }) => ({
    ...state,
    tweets: state.tweets.filter((stateTweet) => {
      if (stateTweet.type === TweetyType.Retweet) {
        return (stateTweet as ReTweety).tweetId !== id;
      }

      return stateTweet.id !== id;
    }),
  })),
  on(FeatReTweetActions.deleteSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.filter((stateTweet) => stateTweet.id !== tweet.id),
  })),
  on(FeatTweetActions.commentDeleteSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.map((stateTweet) => {
      if (stateTweet.id === tweet.id) {
        return {
          ...stateTweet,
          ...tweet,
        };
      }

      return stateTweet;
    }),
  }))
);
