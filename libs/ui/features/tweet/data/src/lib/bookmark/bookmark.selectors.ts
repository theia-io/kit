import { Tweety } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureBookmarkState } from './bookmark.reducers';

/** selectors */
const selectBookmarkState = (state: {
  tweet: {
    bookmark: FeatureBookmarkState;
  };
}) => state.tweet.bookmark;

export const selectBookmarks = createSelector(
  selectBookmarkState,
  (state) => state.bookmarks
);

export const selectIsBookmarked = ({ id }: Tweety) =>
  createSelector(selectBookmarks, (bookmarks) =>
    bookmarks.some(({ tweetId }) => tweetId === id)
  );

// export const selectBookmarksFeed = createSelector(
//   selectBookmarkState,
//   (state) => state.tweets
// );
