import {
  Profile,
  ReTweety,
  TweetComment,
  Tweety,
} from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetActions = createActionGroup({
  source: 'FeatTweetActions',
  events: {
    Tweet: props<{ uuid: string; content: string }>(),
    TweetSuccess: props<{ uuid: string; tweet: Tweety }>(),
    TweetFailure: props<{ uuid: string; message: string }>(),
    //
    Quote: props<{ tweet: Tweety }>(),
    QuoteSuccess: props<{ tweet: Tweety }>(),
    QuoteFailure: props<{ message: string }>(),
    //
    Delete: props<{ tweet: Tweety }>(),
    /**
     * @TODO @FIXME we need to implement functionality when tweet is deleted
     * by author but somebody else has deleted the tweet?
     */
    DeleteSuccess: props<{ tweet: Tweety }>(),
    DeleteFailure: props<{ message: string }>(),
    //
    Comment: props<{ uuid: string; tweet: Tweety; content: string }>(),
    CommentSuccess: props<{ uuid: string; tweet: Tweety }>(),
    CommentFailure: props<{ uuid: string; tweet: Tweety; message: string }>(),
    CommentDelete: props<{ tweet: Tweety; comment: TweetComment }>(),
    CommentDeleteSuccess: props<{ tweet: Tweety }>(),
    CommentDeleteFailure: props<{ message: string }>(),
    //
    Like: props<{ tweet: Tweety }>(),
    LikeSuccess: props<{ tweet: Tweety }>(),
    LikeFailure: props<{ tweet: Tweety }>(),
  },
});

export const FeatReTweetActions = createActionGroup({
  source: 'FeatReTweetActions',
  events: {
    ReTweet: props<{ tweet: Tweety }>(),
    ReTweetSuccess: props<{ tweet: ReTweety }>(),
    ReTweetFailure: props<{ message: string }>(),
    Delete: props<{ tweet: ReTweety }>(),
    DeleteSuccess: props<{ tweet: ReTweety }>(),
    DeleteFailure: props<{ message: string }>(),
  },
});

export const TweetApiActions = createActionGroup({
  source: 'TweetApiActions',
  events: {
    GetAll: props<{
      nextCursor: string | null;
      hasNextPage: boolean | null;
    }>(),
    GetAllSuccess: props<{
      tweets: Tweety[];
      nextCursor: string;
      hasNextPage: boolean;
    }>(),
    GetAllFailure: emptyProps(),
    //
    Get: props<{ tweetId: Tweety['id']; profileId: Profile['id'] }>(),
    GetSuccess: props<{ tweet: Tweety }>(),
    GetFailure: props<{ tweetId: Tweety['id']; profileId: Profile['id'] }>(),
    //
    //
    GetTweetsForProfile: props<{ profileId: string }>(),
    GetTweetsForProfileSuccess: props<{
      tweets: Tweety[];
      nextCursor: string;
      hasNextPage: boolean;
    }>(),
    GetTweetsForProfileFailure: props<{ profileId: string }>(),
    GetTweetsForBookmarkSuccess: props<{
      tweets: Tweety[];
    }>(),
    //
    Post: props<{ tweet: Tweety }>(),
    Update: props<{ tweet: Tweety }>(),
  },
});
