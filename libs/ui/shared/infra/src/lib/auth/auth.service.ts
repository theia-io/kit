import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Profile, User } from '@kitouch/shared-models';

import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import * as Realm from 'realm-web';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ENVIRONMENT } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // angular
  #environment = inject(ENVIRONMENT);
  #router = inject(Router);
  // service
  #realmApp: Realm.App | null = null;
  redirectUrl = `${window.location.origin}/s/${APP_PATH_STATIC_PAGES.Redirect}`;

  #anonymousUser$$ = new BehaviorSubject<Realm.User | undefined>(undefined);
  #realmUser$$ = new BehaviorSubject<Realm.User | undefined>(undefined);

  /** @deprecated will become outdated, use Account from store */
  #account$$ = new BehaviorSubject<Account | undefined>(undefined);
  /** @deprecated will become outdated, use User from store */
  #user$$ = new BehaviorSubject<User | undefined>(undefined);
  /** @deprecated will become outdated, use Profile from store */
  #profiles$$ = new BehaviorSubject<Array<Profile> | undefined>(undefined);

  // essential of the store
  anonymousUser$ = this.#anonymousUser$$.asObservable();
  realmUser$ = this.#realmUser$$.asObservable();
  realmLoggedUser$ = this.realmUser$.pipe(
    filter((user) => !!user && user.providerType !== 'anon-user'),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  /** @deprecated get current profile from Store */
  currentProfile$ = this.#profiles$$.asObservable().pipe(
    map((profiles) => profiles?.[0]),
    filter(Boolean)
  );

  /** Realm helpers */
  // helpers, usually can be avoided
  /** check that the user is not logged in nor refreshed page nor having a valid token after getting to an application a while in a future (once refresh token is not valid anymore) */
  loggedInWithRealmUser$ = this.realmUser$.pipe(
    switchMap((realmUser) => {
      if (realmUser) {
        return of(realmUser);
      }
      return from(this.refreshUser());
    }),
    map(
      (user) => !!user && user.providerType !== 'anon-user'
      // && user.identities?.some(identity => identity.providerType !== 'anon-user')
    ),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  constructor() {
    if (!this.#environment.production) {
      console.log('redirectUrl', this.redirectUrl);
    }
  }

  init() {
    if (this.#realmApp) {
      console.error('Realm already initialized!');
      return this.#realmApp;
    }

    console.info('Initializing Realm...');
    if (!this.#environment.realmAppId) {
      console.error('Realm App Id is not defined for this build.');
    }

    this.#realmApp = new Realm.App({
      id: this.#environment.realmAppId ?? 'application-0-gnmmqxd',
    });

    return this.#realmApp;
  }

  deleteRealmUser() {
    this.realmUser$
      .pipe(
        filter(Boolean),
        filter(() => !!this.#realmApp),
        take(1),
        switchMap((realmUser) => this.#realmApp!.deleteUser(realmUser))
      )
      .subscribe(() => {
        this.#realmUser$$.next(undefined);
        this.#router.navigateByUrl(`/s/${APP_PATH_STATIC_PAGES.SignIn}`);
      });
  }

  async logInAnonymously() {
    const realmApp = this.#realmApp ?? this.init();
    const anonymousUser = await realmApp.logIn(Realm.Credentials.anonymous());

    this.#anonymousUser$$.next(anonymousUser);
  }

  /**
   * This logs user in and redirects either
   * to:
   *  1. Last page user followed // @TODO @FIXME I think there is a bug currently
   * when it redirects to a PageSignInComponent that re-writes one the user followed (
   * somebody has sent it to him or he found on the internet, etc. )
   *  2. or Home if not exist
   */
  googleSignIn() {
    if (!this.#environment.production) {
      console.info('Google signin initiated', this.#realmApp);
    }

    const realmApp = this.#realmApp || this.init();

    const credentials = Realm.Credentials.google({
      redirectUrl: this.redirectUrl,
    });

    return realmApp
      .logIn(credentials)
      .then((realmUser) => {
        this.#realmUser$$.next(realmUser);
        return true;
      })
      .catch((error) => {
        console.error('Error logging  in:', error);
        return false;
      });
  }

  async logout() {
    await this.#realmApp?.currentUser?.logOut();

    this.#realmUser$$.next(undefined);
    this.#anonymousUser$$.next(undefined);
  }

  /**
   * For a page refresh this will resolve the user and will
   * populate it to the Rxjs
   *
   * Note! This operation is a bit heavy in turns of delay (worst case
   * is init, refresh token and getting of current user steps) so can be
   * optimized only to execute of all this flow on recently visited or
   * refreshed Web page
   */
  async refreshUser() {
    if (!this.#realmApp) {
      this.init();
    }

    const realmUser = await this.#realmApp?.currentUser;
    if (!realmUser) {
      console.error('No User, cannot refresh');
      return null;
    }

    // I dont want to have 2 requests at this moment
    // await this.#refreshAccessToken();

    this.#realmUser$$.next(realmUser);
    // const { account, user, profiles } = await this.#getAccountUserProfiles(
    //   realmUser
    // );

    /** @TODO @fixme so accounts, users and profiles are not set  */
    // if (
    //   (account as any)?.identities?.some(
    //     (identity: any) => identity?.provider_type === 'anon-user'
    //   )
    // ) {
    //   return realmUser;
    // }

    // this.#account$$.next(account);
    // this.#user$$.next(user);
    // this.#profiles$$.next(profiles);

    return realmUser;
  }

  async #refreshAccessToken() {
    // this does 2 API requests
    // to location and to session (to create a new one token)
    await this.#realmApp?.currentUser?.refreshAccessToken();
  }

  // async #getAccountUserProfiles(
  //   realmUser: Realm.User
  // ): Promise<{ account: Account; user: User; profiles: Array<Profile> }> {
  //   return await realmUser.functions['getAccountUserProfiles'](
  //     realmUser.id
  //   ).then(({ account, user, profiles }) => ({
  //     account: dbClientAccountAdapter(account),
  //     user: dbClientUserAdapter(user),
  //     profiles: profiles.map(dbClientProfileAdapter),
  //   }));
  // }
}
