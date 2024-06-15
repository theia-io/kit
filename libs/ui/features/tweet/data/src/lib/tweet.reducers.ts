import { Tweety } from '@kitouch/shared/models';
import { createReducer, on } from '@ngrx/store';
import {mongooseEqual} from '@kitouch/shared/utils';
import { FeatTweetActions, TweetApiActions } from './tweet.actions';

export interface FeatureTweetState {
  tweets: Array<Tweety>;
}

export const featTweetInitialState: FeatureTweetState = {
  tweets: [],
};

export const featTweetReducer = createReducer(
  featTweetInitialState,
  on(TweetApiActions.getAllSuccess, (state, { tweets }) => ({
    ...state,
    tweets,
  })),
  on(TweetApiActions.getAllProfileSuccess, (state, { tweets }) => ({
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
