import { Tweety } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatTweetActions = createActionGroup({
  source: 'FeatTweetActions',
  events: {
    GetAll: emptyProps(),
    SetAll: props<{ tweets: Tweety[] }>(),
    Set: props<{ tweet: Tweety }>(),
    LikeTweet: props<{ tweet: Tweety }>(),
  },
});

export const TweetApiActions = createActionGroup({
    source: 'TweetApiActions',
    events: {
      GetAll: emptyProps(),
      SetAll: props<{ tweets: Tweety[] }>(),
      Get: props<{ id: string }>(),
      Set: props<{ tweet: Tweety }>(),
      Delete: props<{ id: string }>(),
      Post: props<{ tweet: Tweety }>(),
      Update: props<{ tweet: Tweety }>(),
    },
  });
  
