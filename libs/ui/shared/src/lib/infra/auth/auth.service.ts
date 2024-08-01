import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Profile, User } from '@kitouch/shared-models';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  FeatAccountApiActions,
  FeatProfileApiActions,
  FeatUserApiActions,
} from '@kitouch/kit-data';
import * as Realm from 'realm-web';
import { BehaviorSubject, filter, from, map, of, switchMap, take } from 'rxjs';
import { APP_PATH } from '../../constants';
import { ENVIRONMENT } from '../environments';
import { RouterEventsService } from '../router/router-events.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // angular
  #environment = inject(ENVIRONMENT);
  #router = inject(Router);
  #actions$ = inject(Actions);
  #store = inject(Store);
  // app
  routerEventsService = inject(RouterEventsService);
  // service
  #realmApp: Realm.App | null = null;
  redirectUrl = `${window.location.origin}/redirect`;

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
  /** @deprecated get current profile from Store */
  currentProfile$ = this.#profiles$$.asObservable().pipe(
    map((profiles) => profiles?.[0]),
    filter(Boolean)
  );

  /** Realm helpers */
  // helpers, usually can be avoided
  /** check that the user is not logged in nor refreshed page nor having a valid token after getting to an application a while in a future (once refresh token is not valid anymore) */
  loggedInWithRealmUser$ = this.realmUser$.pipe(
    take(1),
    switchMap((realmUser) => {
      if (realmUser) {
        return of(realmUser);
      }
      return from(this.#refreshUser());
    }),
    map(
      (user) => !!user && user.providerType !== 'anon-user'
      // && user.identities?.some(identity => identity.providerType !== 'anon-user')
    )
  );

  constructor() {
    if (!this.#environment.production) {
      console.log('redirectUrl', this.redirectUrl);
    }

    this.#actions$
      .pipe(
        ofType(FeatAccountApiActions.deleteSuccess),
        switchMap(() =>
          this.realmUser$.pipe(
            filter(Boolean),
            filter(() => !!this.#realmApp),
            take(1)
          )
        ),
        switchMap((realmUser) => this.#realmApp!.deleteUser(realmUser))
      )
      .subscribe(() => {
        this.#realmUser$$.next(undefined);
        this.#router.navigateByUrl('/sign-in');
      });

    this.#account$$.pipe(filter(Boolean)).subscribe((account) => {
      this.#store.dispatch(FeatAccountApiActions.setAccount({ account }));
    });

    this.#user$$.pipe(filter(Boolean)).subscribe((user) => {
      this.#store.dispatch(FeatUserApiActions.setUser({ user }));
    });

    this.#profiles$$.pipe(filter(Boolean)).subscribe((profiles) => {
      /** @TODO @FIXME add better logic for default profile once multi-profile feature is implemented */
      const currentProfile = profiles?.[0];

      this.#store.dispatch(
        FeatProfileApiActions.setCurrentProfile({ profile: currentProfile })
      );
      const followingProfilesIds = currentProfile.following?.map((id) => id);
      if (followingProfilesIds?.length) {
        this.#store.dispatch(
          FeatProfileApiActions.getFollowingProfiles({
            profileIds: followingProfilesIds.map(({ id }) => id),
          })
        );
      }
      this.#store.dispatch(FeatProfileApiActions.setProfiles({ profiles }));
    });
  }

  init() {
    if (this.#realmApp) {
      console.error('Realm already initialized!');
      return this.#realmApp;
    }

    console.info('Initializing Realm...');

    this.#realmApp = new Realm.App({ id: 'application-0-gnmmqxd' });
    return this.#realmApp;
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

    if (!this.#realmApp) {
      this.init();
    }

    const credentials = Realm.Credentials.google({
      redirectUrl: this.redirectUrl,
    });

    this.#realmApp
      ?.logIn(credentials)
      .then((realmUser) => {
        this.#realmUser$$.next(realmUser);
        return this.#getAccountUserProfiles(realmUser);
      })
      .then(({ account, user, profiles }) => {
        if (!account || !user || !profiles) {
          return this.#router.navigateByUrl('join');
        }

        this.#account$$.next(account);
        this.#user$$.next(user);
        this.#profiles$$.next(profiles);

        if (!user.experiences?.length) {
          this.#router.navigateByUrl(APP_PATH.AboutYourself);
          return;
        }

        /** TODO HERE WE CAN REDIRECT TO FILL IN INFORMATION PAGE */
        this.routerEventsService.lastUrlBeforeCancelled$
          .pipe(take(1))
          .subscribe((urlBeforeSignIn) => {
            console.info('[AUTH SERVICE] urlBeforeSignIn:', urlBeforeSignIn);
            this.#router.navigateByUrl(urlBeforeSignIn ?? 'home');
          });

        return;
      })
      .catch((error) => {
        console.error('Error logging  in:', error);
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
  async #refreshUser() {
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
    const { account, user, profiles } = await this.#getAccountUserProfiles(
      realmUser
    );

    /** @TODO @fixme so accounts, users and profiles are not set  */
    if (
      (account as any)?.identities?.some(
        (identity: any) => identity?.provider_type === 'anon-user'
      )
    ) {
      return realmUser;
    }

    this.#account$$.next(account);
    this.#user$$.next(user);
    this.#profiles$$.next(profiles);

    return realmUser;
  }

  async #refreshAccessToken() {
    // this does 2 API requests
    // to location and to session (to create a new one token)
    await this.#realmApp?.currentUser?.refreshAccessToken();
  }

  getLoggedInAnonymousUser$() {
    return this.anonymousUser$.pipe(
      take(1),
      switchMap((anonymousUser) => {
        if (anonymousUser) {
          return of(anonymousUser);
        }
        return from(this.#refreshUser());
      }),
      map((user) => !!user)
    );
  }

  async #getAccountUserProfiles(
    realmUser: Realm.User
  ): Promise<{ account: Account; user: User; profiles: Array<Profile> }> {
    return await realmUser.functions['getAccountUserProfiles'](realmUser.id);
  }
}
