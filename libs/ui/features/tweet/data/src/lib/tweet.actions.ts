import { Tweety } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetActions = createActionGroup({
  source: 'FeatTweetActions',
  events: {
    Tweet: props<{ uuid: string, content: string }>(),
    TweetSuccess: props<{ uuid: string, tweet: Tweety }>(),
    TweetFailure: props<{ uuid: string, message: string }>(),
    Like: props<{ tweet: Tweety }>(),
    LikeSuccess: props<{ tweet: Tweety }>(),
    LikeFailure: props<{ tweet: Tweety }>(),
  },
});

export const TweetApiActions = createActionGroup({
  source: 'TweetApiActions',
  events: {
    GetAll: emptyProps(),
    GetAllFailure: emptyProps(),
    SetAll: props<{ tweets: Tweety[] }>(),
    Get: props<{ id: string }>(),
    Delete: props<{ id: string }>(),
    Post: props<{ tweet: Tweety }>(),
    Update: props<{ tweet: Tweety }>(),
  },
});
