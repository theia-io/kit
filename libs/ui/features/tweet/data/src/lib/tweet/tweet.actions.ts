import { Profile, Tweety } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetActions = createActionGroup({
  source: 'FeatTweetActions',
  events: {
    Tweet: props<{ uuid: string; content: string }>(),
    TweetSuccess: props<{ uuid: string; tweet: Tweety }>(),
    TweetFailure: props<{ uuid: string; message: string }>(),
    //
    Delete: props<{
      ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>;
    }>(),
    DeleteSuccess: props<{
      ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>;
    }>(),
    DeleteFailure: props<{
      ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>;
    }>(),
    //
    Comment: props<{ uuid: string; tweet: Tweety; content: string }>(),
    CommentSuccess: props<{ uuid: string; tweet: Tweety }>(),
    CommentFailure: props<{ uuid: string; tweet: Tweety }>(),
    //
    Like: props<{ tweet: Tweety }>(),
    LikeSuccess: props<{ tweet: Tweety }>(),
    LikeFailure: props<{ tweet: Tweety }>(),
  },
});

export const TweetApiActions = createActionGroup({
  source: 'TweetApiActions',
  events: {
    GetAll: emptyProps(),
    GetAllSuccess: props<{ tweets: Tweety[] }>(),
    GetAllFailure: emptyProps(),
    //
    Get: props<{
      ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>;
    }>(),
    GetSuccess: props<{ tweets: Array<Tweety> }>(),
    GetFailure: props<{
      ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>;
    }>(),
    //
    //
    GetTweetsForProfile: props<{ profileId: string }>(),
    GetTweetsForProfileSuccess: props<{ tweets: Tweety[] }>(),
    GetTweetsForProfileFailure: props<{ profileId: string }>(),
    GetTweetsForBookmarkSuccess: props<{ tweets: Tweety[] }>(),
    //
    Post: props<{ tweet: Tweety }>(),
    Update: props<{ tweet: Tweety }>(),
  },
});
