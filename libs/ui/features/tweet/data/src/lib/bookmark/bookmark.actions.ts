import { Bookmark, Profile, Tweety } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetBookmarkActions = createActionGroup({
  source: 'FeatTweetBookmarkActions',
  events: {
    GetAll: emptyProps(),
    GetAllSuccess: props<{ bookmarks: Array<Bookmark> }>(),
    GetAllFailure: props<{ message: string }>(),
    //
    Bookmark: props<{
      tweetId: Tweety['id'];
      profileIdTweetyOwner: Bookmark['profileIdTweetyOwner'];
    }>(),
    BookmarkSuccess: props<{ bookmark: Bookmark }>(),
    BookmarkFailure: props<{ tweetId: Tweety['id']; message: string }>(),
    //
    RemoveBookmark: props<{ tweetId: Tweety['id'] }>(),
    RemoveBookmarkSuccess: props<{
      tweetId: Tweety['id'];
      profileId: Profile['id'];
    }>(),
    RemoveBookmarkFailure: props<{ tweetId: Tweety['id']; message: string }>(),
    RemoveBookmarkAsTweetRemoved: props<{ tweetId: Tweety['id'] }>(),
    //
    GetBookmarksFeed: props<{ bookmarks: Array<Bookmark> }>(),
    GetBookmarksFeedSuccess: props<{ tweets: Array<Tweety> }>(),
    GetBookmarksFeedFailure: props<{
      message: string;
    }>(),
  },
});
