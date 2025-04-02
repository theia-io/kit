import { Account, Profile, User } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatAuth0Events = createActionGroup({
  source: 'FeatAuth0Events',
  events: {
    HandleRedirect: emptyProps(),
    HandleRedirectSuccess: props<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(),
    HandleRedirectFailure: emptyProps(),
    SetAuthState: props<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(),
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
