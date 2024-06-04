import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as Realm from 'realm-web';
import { BehaviorSubject, map, take } from 'rxjs';
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
  isLoggedIn$ = this.user$.asObservable().pipe(map((user) => !!user));

  init() {
    if (this.#realmApp) {
      console.error('Realm already initialized!');
      return;
    }

    console.log('Initializing Realm...');

    this.#realmApp = new Realm.App({ id: 'application-0-gnmmqxd' });
    return this.#realmApp;
  }

  /** @TODO @FIXME implement signing in starts a login flow and also *potentially*
   * listen to `realmApp` (which can be switched to Observable as well)
   *
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
        console.log('User logged in0:', user, this.#realmApp);
        this.user$.next(user);

        this.routerEventsService.latestBeforeRedirect$
          .pipe(take(1))
          .subscribe((beforeRedirect) => {
            console.log('beforeRedirect', beforeRedirect);
            this.#router.navigateByUrl(beforeRedirect);
          });

        return user;
      })
      .catch((error) => {
        console.error('Error logging  in:', error);
      });
  }

  /**
   * For a page refresh this will resolve the user and will 
   * populate it to the Rxjs
   */
  async tryGetAndRefreshUser() {
    if (!this.#realmApp) {
      this.init();
    }

    const user = await this.#realmApp?.currentUser;
    this.user$.next(user);
    return user;
  }

  async refreshToken() {
    await this.#realmApp?.currentUser?.refreshAccessToken();
    this.user$.next(this.#realmApp?.currentUser);
  }

  async logout() {
    await this.#realmApp?.currentUser?.logOut();
    this.user$.next(undefined);
  }
}
