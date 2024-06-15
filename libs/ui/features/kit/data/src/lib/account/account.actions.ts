import { Account } from '@kitouch/shared/models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatAccountApiActions = createActionGroup({
  source: 'FeatAccountApiActions',
  events: {
    SetAccount: props<{ account: Account }>(),
  },
});
