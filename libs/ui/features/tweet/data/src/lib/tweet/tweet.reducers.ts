import { Tweety } from '@kitouch/shared-models';
import { mergeArr } from '@kitouch/ui-shared';
import { mongooseEqual } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import _ from 'lodash';
import { FeatTweetActions, TweetApiActions } from './tweet.actions';

export interface FeatureTweetState {
  tweets: Array<Tweety>;
}

const featTweetInitialState: FeatureTweetState = {
  tweets: [],
};

export const featTweetTweetsReducer = createReducer(
  featTweetInitialState,
  on(
    TweetApiActions.getSuccess,
    ({ tweets: stateTweets, ...restState }, { tweet }) => ({
      ...restState,
      tweets: [tweet, ...stateTweets],
    })
  ),
  on(
    TweetApiActions.getAllSuccess,
    TweetApiActions.getTweetsForProfileSuccess,
    TweetApiActions.getTweetsForBookmarkSuccess,
    (state, { tweets }) => ({
      ...state,
      tweets: mergeArr(tweets, state.tweets),
    })
  ),
  on(FeatTweetActions.tweetSuccess, (state, { tweet }) => ({
    ...state,
    tweets: [tweet, ...state.tweets],
  })),
  on(FeatTweetActions.deleteSuccess, (state, { tweetId }) => ({
    ...state,
    tweets: state.tweets.filter(({ id }) => id !== tweetId),
  })),
  on(FeatTweetActions.likeSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.map((existingTweet) => {
      if (mongooseEqual(existingTweet, tweet)) {
        return tweet;
      }

      return existingTweet;
    }),
  })),
  on(FeatTweetActions.commentSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.map((existingTweet) => {
      if (mongooseEqual(existingTweet, tweet)) {
        return tweet;
      }

      return existingTweet;
    }),
  })),
  on(
    FeatTweetActions.commentDeleteSuccess,
    (state, { tweet, comment: { profileId, content, createdAt } }) => ({
      ...state,
      tweets: state.tweets.map((stateTweet) => {
        if (stateTweet.id === tweet.id) {
          return {
            ...stateTweet,
            ...tweet,
            ...state,
            comments: stateTweet.comments?.filter(
              (stateComment) =>
                !_.isEqual(stateComment, { profileId, content, createdAt })
            ),
          };
        }
        return stateTweet;
      }),
    })
  ),
  on(FeatTweetActions.reTweetSuccess, (state, { tweet }) => ({
    ...state,
    tweets: [tweet, ...state.tweets],
  }))
);
