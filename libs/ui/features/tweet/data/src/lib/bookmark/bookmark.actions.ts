import { Bookmark, Tweety } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetBookmarkActions = createActionGroup({
  source: 'FeatTweetBookmarkActions',
  events: {
    GetAll: emptyProps(),
    GetAllSuccess: props<{ bookmarks: Array<Bookmark> }>(),
    GetAllFailure: props<{ message: string }>(),
    Bookmark: props<{ tweetId: Tweety['id'] }>(),
    BookmarkSuccess: props<{ bookmark: Bookmark }>(),
    BookmarkFailure: props<{ tweetId: Tweety['id']; message: string }>(),
    RemoveBookmark: props<{ tweetId: Tweety['id'] }>(),
    RemoveBookmarkSuccess: props<{ bookmark: Bookmark }>(),
    RemoveBookmarkFailure: props<{ tweetId: Tweety['id']; message: string }>(),
    GetBookmarksFeed: props<{ bookmarks: Array<Bookmark> }>(),
    GetBookmarksFeedSuccess: props<{ tweets: Array<Tweety> }>(),
    GetBookmarksFeedFailure: props<{
      bookmarks: Array<Bookmark>;
      message: string;
    }>(),
  },
});
