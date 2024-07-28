import { Tweety } from '@kitouch/shared-models';
import { mongooseEqual } from '@kitouch/shared/utils';
import { mergeArr } from '@kitouch/ui/shared';
import { createReducer, on } from '@ngrx/store';
import _ from 'lodash';
import { FeatTweetActions, TweetApiActions } from './tweet.actions';

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
      tweets: mergeArr(tweets, state.tweets),
    })
  ),
  on(FeatTweetActions.tweetSuccess, (state, { tweet }) => ({
    ...state,
    tweets: [tweet, ...state.tweets],
  })),
  on(FeatTweetActions.deleteSuccess, (state, { ids }) => ({
    ...state,
    tweets: state.tweets.filter(
      ({ id }) => !ids.some(({ tweetId }) => tweetId === id)
    ),
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
