import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FeatAuth0Events, selectCurrentUser } from '@kitouch/kit-data';
import { Account, Profile, User } from '@kitouch/shared-models';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ENVIRONMENT } from '../environments';
import { LocalStoreService } from '../localstore.service';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  #store = inject(Store);
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);
  #localStoreService = inject(LocalStoreService);

  loggedInUser$ = this.#store.pipe(select(selectCurrentUser));
  loggedIn$ = this.loggedInUser$.pipe(map((user) => !!user));

  readonly #separateWindow = 'kit.auth.separate-window';
  readonly #beforeRedirectUrlKey = 'kit.auth.pre-redirect-url';

  // #currentSessionAccountUserProfiles$ = of(true)
  //   .pipe(
  //     switchMap(() => {
  //       return this.#http.get<{
  //         account: Account;
  //         user: User;
  //         profiles: Array<Profile>;
  //       }>(`${this.#environment.api.kit}`);
  //     }),
  //     share({resetOnRefCountZero: true})
  //   );

  logout() {
    window.location.href = `${this.#environment.api.auth}/logout`; // express-openid-connect handles this
  }

  getPostRedirectUrl() {
    const urlBeforeRedirect = this.#localStoreService.getItem(
      this.#beforeRedirectUrlKey
    );
    this.#localStoreService.removeItem(this.#beforeRedirectUrlKey);

    return urlBeforeRedirect;
  }

  signIn(urlToOpenAfterSignIn?: string) {
    console.log('signIn', urlToOpenAfterSignIn);
    if (urlToOpenAfterSignIn) {
      this.#localStoreService.setItem(
        this.#beforeRedirectUrlKey,
        urlToOpenAfterSignIn
      );
    }
    window.location.href = `${this.#environment.api.auth}/login`; // express-openid-connect handles this
  }

  signInTab() {
    this.#localStoreService.setItem(this.#separateWindow, JSON.stringify(true));

    window.open(`${this.#environment.api.auth}/login`, '_blank')?.focus();

    /**
     * Currently used as login-in into separate window,
     *
     * @TODO (check)
     * should we use CrossTabSyncService instead of localstorage
     * and keep LS as fallback?
     **/
    return new Promise((resolve, reject) => {
      const storageEventHandler = (event: StorageEvent) => {
        console.info(
          '[UI Auth0Service] Storage Event Origin:',
          event,
          (event as any).origin
        );

        // Check if it's the key we are waiting for
        if (
          event.key === this.#separateWindow &&
          event.url.includes(window.origin)
        ) {
          clearTimeout(timeoutId);
          this.#store.dispatch(FeatAuth0Events.tryAuth());

          window.removeEventListener('storage', storageEventHandler);
          resolve(true);
        }
      };

      // --- Add the listener using the named function reference ---
      window.addEventListener('storage', storageEventHandler);

      const timeoutDuration = 60000; // 60 seconds
      const timeoutId = setTimeout(() => {
        console.warn(
          `signInTab timed out after ${
            timeoutDuration / 1000
          }s waiting for storage event.`
        );
        window.removeEventListener('storage', storageEventHandler); // Clean up listener on timeout
        reject(new Error('Login window timed out or was closed.'));
      }, timeoutDuration);
    });
  }

  separateWindowSignIn() {
    return JSON.parse(
      this.#localStoreService.getItem(this.#separateWindow) ?? 'false'
    );
  }

  separateWindowSignInClearAndTrigger() {
    return this.#localStoreService.removeItem(this.#separateWindow);
  }

  getCurrentSessionAccountUserProfiles(): Observable<{
    account: Account;
    user: User;
    profiles: Array<Profile>;
  }> {
    return this.#http.get<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(`${this.#environment.api.kit}`);
    // return this.#currentSessionAccountUserProfiles$
  }
}
