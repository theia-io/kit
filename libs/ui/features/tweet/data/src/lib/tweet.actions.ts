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
    GetAllSuccess: props<{ tweets: Tweety[] }>(),
    GetAllFailure: emptyProps(),
    GetProfileTweets: props<{ profileId: string }>(),
    GetProfileTweetsSuccess: props<{ tweets: Tweety[] }>(),
    GetProfileTweetsFailure: props<{ profileId: string }>(),
    Get: props<{ tweetId: string, profileId: string }>(),
    GetSuccess: props<{ tweet: Tweety }>(),
    GetFailure: props<{ tweetId: string, profileId: string }>(),
    Delete: props<{ id: string }>(),
    Post: props<{ tweet: Tweety }>(),
    Update: props<{ tweet: Tweety }>(),
  },
});
