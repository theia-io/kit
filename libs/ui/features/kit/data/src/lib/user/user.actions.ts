import { User } from '@kitouch/shared/models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatUserApiActions = createActionGroup({
  source: 'FeatUserApiActions',
  events: {
    SetUser: props<{ user: User }>(),
  },
});
