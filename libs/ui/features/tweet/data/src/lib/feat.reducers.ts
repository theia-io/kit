import { Bookmark, Tweety } from '@kitouch/shared/models';
import { combineReducers } from '@ngrx/store';
import { featTweetBookmarkReducer } from './bookmark/bookmark.reducers';
import { featTweetTweetsReducer } from './tweet/tweet.reducers';
export interface FeatureTweetState {
  tweets: Array<Tweety>;
  bookmarks: Array<Bookmark>;
}

export const featTweetReducer = combineReducers({
  bookmark: featTweetBookmarkReducer,
  tweet: featTweetTweetsReducer,
});
