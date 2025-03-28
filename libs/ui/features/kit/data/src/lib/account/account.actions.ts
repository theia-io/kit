import { Account, Auth0User } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatAuth0Events = createActionGroup({
  source: 'FeatAuth0Events',
  events: {
    HandleRedirect: emptyProps(),
    HandleRedirectSuccess: props<{ user: Auth0User }>(),
    HandleRedirectFailure: emptyProps(),
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
