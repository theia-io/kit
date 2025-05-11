import { Bookmark } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatBookmarksActions } from './bookmark.actions';
import { mergeArr } from '@kitouch/utils';

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
  on(FeatBookmarksActions.getAllSuccess, (state, { bookmarks }) => ({
    ...state,
    bookmarks,
  })),
  on(FeatBookmarksActions.bookmarkSuccess, (state, { bookmark }) => ({
    ...state,
    bookmarks: mergeArr([bookmark], state.bookmarks),
    // tweets: mergeArr(state.tweets, )
  })),
  on(
    FeatBookmarksActions.removeBookmarkSuccess,
    (state, { tweetId, profileId }) => ({
      ...state,
      bookmarks: state.bookmarks.filter(
        (bookmark) =>
          bookmark.tweetId !== tweetId &&
          bookmark.profileIdBookmarker === profileId,
      ),
    }),
  ),
  on(
    FeatBookmarksActions.removeBookmarkAsTweetRemoved,
    (state, { tweetId }) => ({
      ...state,
      bookmarks: state.bookmarks.filter(
        (bookmark) => bookmark.tweetId !== tweetId,
      ),
    }),
  ),
);
