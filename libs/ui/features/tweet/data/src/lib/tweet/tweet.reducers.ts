import { Tweety, TweetyType } from '@kitouch/shared-models';
import { addOrUpdate, mergeArr } from '@kitouch/ui-shared';
import { createReducer, on } from '@ngrx/store';
import _ from 'lodash';
import {
  FeatReTweetActions,
  FeatTweetActions,
  TweetApiActions,
} from './tweet.actions';

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
    TweetApiActions.getAllSuccess,
    TweetApiActions.getTweetsForProfileSuccess,
    TweetApiActions.getTweetsForBookmarkSuccess,
    (state, { tweets }) => ({
      ...state,
      tweets: mergeArr(tweets, state.tweets),
    })
  ),
  on(FeatTweetActions.deleteSuccess, (state, { tweet: { id } }) => ({
    ...state,
    tweets: state.tweets.filter((stateTweet) => {
      if (stateTweet.type === TweetyType.Retweet) {
        return stateTweet.referenceId !== id;
      }

      return stateTweet.id !== id;
    }),
  })),
  on(FeatReTweetActions.deleteSuccess, (state, { tweet }) => ({
    ...state,
    tweets: state.tweets.filter((retweetTweet) => tweet.id !== retweetTweet.id),
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
  )
);
