import { Tweety } from '@kitouch/shared/models';
import { mongooseEqual } from '@kitouch/shared/utils';

import { createReducer, on } from '@ngrx/store';
import { FeatTweetActions } from './tweet.actions';

export interface FeatureTweetState {
  tweets: Array<Tweety>;
}

export const featTweetInitialState: FeatureTweetState = {
  tweets: [],
};

export const featTweetReducer = createReducer(
  featTweetInitialState,
  on(FeatTweetActions.setAll, (state, { tweets }) => ({
    ...state,
    tweets,
  })),
  on(FeatTweetActions.set, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.map((currentTweet) => {
      if (mongooseEqual(currentTweet, tweet)) {
        return tweet;
      }
      return currentTweet;
    }),
  }))
);
