import { Tweety } from '@kitouch/shared/models';
import { createReducer, on } from '@ngrx/store';
import {mongooseEqual} from '@kitouch/shared/utils';
import { FeatTweetActions, TweetApiActions } from './tweet.actions';

// 2*N(0)
const combineTweetsV2 = (
  arr1: Array<Tweety>,
  arr2: Array<Tweety>
): Array<Tweety> => {
  const combined = new Map<string, Tweety>();

  arr1.forEach((tweet) => {
    combined.set(tweet.id, tweet);
  });

  // has to be after "current" state since might have better info
  arr2.forEach((tweet) => {
    combined.set(tweet.id, tweet);
  });

  return [...combined.values()];
};

export interface FeatureTweetState {
  tweets: Array<Tweety>;
}

const featTweetInitialState: FeatureTweetState = {
  tweets: [],
};

export const featTweetReducer = createReducer(
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

    const updatedTweets = state.tweets.map(existingTweet => {
      if(mongooseEqual(existingTweet, tweet)) {
        tweetFoundUpdated = true;
        return tweet;
      };
      
      return existingTweet;
    });

    if(tweetFoundUpdated) {
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
    tweets: state.tweets.map(existingTweet => {
      if(mongooseEqual(existingTweet, tweet)) {
        return tweet;
      };
      
      return existingTweet;
    }),
  })),
);
