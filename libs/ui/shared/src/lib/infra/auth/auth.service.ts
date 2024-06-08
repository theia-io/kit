import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as Realm from 'realm-web';
import { BehaviorSubject, map, merge, of, switchMap, take, tap } from 'rxjs';
import { RouterEventsService } from '../router/router-events.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // angular
  #router = inject(Router);
  // app
  routerEventsService = inject(RouterEventsService);
  // service
  #realmApp: Realm.App | null = null;
  redirectUrl = 'http://localhost:4200/redirect';

  // essential of the store
  user$ = new BehaviorSubject<any>(undefined);

  // helpers, usually can be avoided
  isLoggedIn$ = this.user$.asObservable().pipe(
    take(1),
    map((user) => !!user)
  );
  /** check that the user is not logged in nor refreshed page nor having a valid token after getting to an application a while in a future (once refresh token is not valid anymore) */
  isHardLoggedIn$ = this.user$.asObservable().pipe(
    take(1),
    switchMap((user) =>
      !user ? merge(this.user$, of(this.#refreshUser())) : this.user$
    ),
    tap((user) =>
      console.log('TESTING TESTING TESTING isHardLoggedIn$ ---- 000', user)
    ),
    map((user) => !!user),
    tap((user) => console.log('TESTING TESTING TESTING isHardLoggedIn$', user))
  );

  init() {
    if (this.#realmApp) {
      console.error('Realm already initialized!');
      return;
    }

    console.log('Initializing Realm...');

    this.#realmApp = new Realm.App({ id: 'application-0-gnmmqxd' });
    return this.#realmApp;
  }

  /**
   * This logs user in and redirects either
   * to:
   *  1. Last page user followed // @TODO @FIXME I think there is a bug currently
   * when it redirects to a JoinComponent that re-writes one the user followed (
   * somebody has sent it to him or he found on the internet, etc. )
   *  2. or Home if not exist
   */
  googleSignIn() {
    console.log('Google signin initiated', this.#realmApp);
    if (!this.#realmApp) {
      this.init();
    }

    const credentials = Realm.Credentials.google({
      redirectUrl: this.redirectUrl,
    });

    this.#realmApp
      ?.logIn(credentials)
      .then((user) => {
        this.user$.next(user);

        this.routerEventsService.lastUrlBeforeCancelled$
          .pipe(take(1))
          .subscribe((urlBeforeSignIn) => {
            this.#router.navigateByUrl(urlBeforeSignIn ?? 'home');
          });

        return user;
      })
      .catch((error) => {
        console.error('Error logging  in:', error);
      });
  }

  async logout() {
    await this.#realmApp?.currentUser?.logOut();
    this.user$.next(undefined);
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

    const user = await this.#realmApp?.currentUser;
    if (!user) {
      console.error('No User, cannot refresh');
      return null;
    }

    // I dont want to have 2 requests at this moment
    // await this.#refreshAccessToken();

    this.user$.next(user);
    return user;
  }

  async #refreshAccessToken() {
    // this does 2 API requests 
    // to location and to session (to create a new one token)
    await this.#realmApp?.currentUser?.refreshAccessToken();
  }
}
