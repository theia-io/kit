import { Bookmark } from '@kitouch/shared/models';
import { mergeArr } from '@kitouch/ui/shared';
import { createReducer, on } from '@ngrx/store';
import { FeatTweetBookmarkActions } from './bookmark.actions';

export interface FeatureBookmarkState {
  bookmarks: Array<Bookmark>; // possibly in the future not only tweets can be bookmarked
  // if so then likely bookmark has to be moved out
  // tweets: Array<Tweety>;
}

const featBookmarkInitialState: FeatureBookmarkState = {
  bookmarks: [],
  // tweets: [],
};

export const featTweetBookmarkReducer = createReducer(
  featBookmarkInitialState,
  on(FeatTweetBookmarkActions.getAllSuccess, (state, { bookmarks }) => ({
    ...state,
    bookmarks,
  })),
  on(FeatTweetBookmarkActions.bookmarkSuccess, (state, { bookmark }) => ({
    ...state,
    bookmarks: mergeArr([bookmark], state.bookmarks),
    // tweets: mergeArr(state.tweets, )
  })),
  on(
    FeatTweetBookmarkActions.removeBookmarkSuccess,
    (state, { bookmark: { id } }) => ({
      ...state,
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
      // tweets: state.tweets.filter((bookmarkedTweet) => bookmarkedTweet.id !== tweetId && bookmarkedTweet.profileId !== profileId)
    })
  ),
  on(FeatTweetBookmarkActions.removeBookmarkAsTweetRemoved, (state, {tweetId}) => ({
    ...state,
    bookmarks: state.bookmarks.filter((bookmark) => bookmark.tweetId !== tweetId)
  })),
);
