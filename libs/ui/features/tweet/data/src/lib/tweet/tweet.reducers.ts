import { Tweety } from '@kitouch/shared/models';
import { mongooseEqual } from '@kitouch/shared/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatTweetActions, TweetApiActions } from './tweet.actions';
import { mergeArr } from '@kitouch/ui/shared';

// 2*N(0)
const combineV2 = <T>(
  arr1: Array<T & { id: string }>,
  arr2: Array<T & { id: string }>
): Array<T> => {
  const combined = new Map<string, T>();

  arr1.forEach((item) => {
    combined.set(item.id, item);
  });

  // has to be after "current" state since might have better info
  arr2.forEach((item) => {
    combined.set(item.id, item);
  });

  return [...combined.values()];
};

export interface FeatureTweetState {
  tweets: Array<Tweety>;
}

const featTweetInitialState: FeatureTweetState = {
  tweets: [],
};

export const featTweetTweetsReducer = createReducer(
  featTweetInitialState,
  on(
    TweetApiActions.getAllSuccess,
    TweetApiActions.getSuccess,
    TweetApiActions.getTweetsForProfileSuccess,
    TweetApiActions.getTweetsForBookmarkSuccess,
    (state, { tweets }) => ({
      ...state,
      tweets: mergeArr(state.tweets, tweets),
    })
  ),
  on(FeatTweetActions.tweetSuccess, (state, { tweet }) => ({
    ...state,
    tweets: [tweet, ...state.tweets],
  })),
  on(FeatTweetActions.deleteSuccess, (state, { ids }) => ({
    ...state,
    tweets: state.tweets.filter(({id}) => !ids.some(({tweetId}) => tweetId === id)),
  })),
  on(FeatTweetActions.likeSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.map((existingTweet) => {
      if (mongooseEqual(existingTweet, tweet)) {
        return tweet;
      }

      return existingTweet;
    }),
  }))
);
