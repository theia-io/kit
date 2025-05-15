import { Account, Profile, User } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatAuth0Events = createActionGroup({
  source: 'FeatAuth0Events',
  events: {
    /**
     * Whenever app is opened we call this action to
     * see if user is logged in or not. This will call
     * the Auth0Service.getCurrentSessionAccountUserProfiles()
     * which will return the current session, account, user.
     *
     * If it returns 428 (meaning that user is not logged in) -
     * but he was logged in before - system will
     * `dispatch(FeatAuth0Events.tryAuth())` action which will
     * initiate the auth flow.
     *
     **/
    ResolveUserForApp: emptyProps(),
    ResolveUserForAppSuccess: props<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(),
    ResolveUserForAppFailure: emptyProps(),
    /** Try auth is used to recover JWT token on failed
     * requests. For example, when user was using the app and.
     *
     * One exception is Auth0Service.signInTab() which
     * has to pass over resolving in a saparate window.
     * Once oidc (OpenID Connect) login on Auth0 successful -
     * the tab where connection was has to sent the action
     * (Note! This currently sends this action via Browser
     * Storage API) and close itself.
     *
     * Currently opened tab (which used has opened and wants
     * to continue on login success) has to accept that
     * action and pass execution over to the actions he
     * has been doing just before the login request.
     *
     * */
    TryAuth: emptyProps(),
    TryAuthSuccess: props<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(),
    TryAuthFailure: emptyProps(),
    /**
     * Whenever user is logged in manually it will be redirected
     * to the Auth0 login page. After successful login the user
     * will be redirected back to the app on the app Home page
     * `/app/`. If unsuccessful - the user will be redirected to
     * saved page (flow that Auth0Service.signInTab triggered)
     * OR the app Home page `/app/` as well.
     **/
    HandleRedirect: props<{
      postLoginUrl: string | null;
    }>(),
    HandleRedirectSuccess: props<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(),
    HandleRedirectFailure: emptyProps(),
    /** Notifies (ngrx) Store that user is there. The whole app
     * uses Store to understand if user is logged in or not.
     * This is set via single source of access via
     *
     ** Note!
     * Auth0Service.loggedInUser$ and Auth0Service.loggedIn$
     * streams.
     *
     */
    SetAuthState: props<{
      account: Account | null;
      user: User | null;
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
