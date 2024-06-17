import { Tweety } from '@kitouch/shared/models';
import { mongooseEqual } from '@kitouch/shared/utils';
import { createReducer, on } from '@ngrx/store';
import {
  FeatTweetActions,
  TweetApiActions
} from './tweet.actions';

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
  on(TweetApiActions.getAllSuccess, (state, { tweets }) => ({
    ...state,
    tweets,
  })),
  on(TweetApiActions.getProfileTweetsSuccess, (state, { tweets }) => ({
    ...state,
    tweets,
  })),
  on(TweetApiActions.getSuccess, (state, { tweet }) => {
    let tweetFoundUpdated = false;

    const updatedTweets = state.tweets.map((existingTweet) => {
      if (mongooseEqual(existingTweet, tweet)) {
        tweetFoundUpdated = true;
        return tweet;
      }

      return existingTweet;
    });

    if (tweetFoundUpdated) {
      return {
        ...state,
        tweets: updatedTweets,
      };
    } else {
      return {
        ...state,
        tweets: [tweet, ...state.tweets],
      };
    }
  }),
  on(FeatTweetActions.tweetSuccess, (state, { tweet }) => ({
    ...state,
    tweets: [tweet, ...state.tweets],
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
