import { Account } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatAccountEvents = createActionGroup({
  source: 'FeatAccountEvents',
  events: {
    HandleRedirect: emptyProps(),
  },
});

export const FeatAccountApiActions = createActionGroup({
  source: 'FeatAccountApiActions',
  events: {
    SetAccount: props<{ account: Account }>(),
    Delete: props<{ account: Account }>(),
    DeleteSuccess: props<{ account: Account }>(),
    DeleteFailure: props<{ account: Account; message: string }>(),
  },
});
