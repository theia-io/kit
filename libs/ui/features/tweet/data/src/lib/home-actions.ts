import { Tweety } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HomeTweetActions = createActionGroup({
  source: 'HomeTweet',
  events: {
    GetAll: emptyProps(),
    SetAll: props<{ tweets: Tweety[] }>(),
    Get: props<{ id: string }>(),
    Update: props<{ id: string }>(),
    Delete: props<{ id: string }>(),
    Post: props<{ data: Tweety }>(),
  },
});
