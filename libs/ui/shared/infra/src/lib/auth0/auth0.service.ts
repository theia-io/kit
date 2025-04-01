import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { selectCurrentUser } from '@kitouch/kit-data';
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
  readonly #beforeRedirectKey = 'kit.auth.pre-redirect';

  logout() {
    window.location.href = `http://localhost:3000/api/auth/logout`; // express-openid-connect handles this
  }

  postSignInUrl() {
    const urlBeforeRedirect = this.#localStoreService.getItem(
      this.#beforeRedirectKey
    );

    if (urlBeforeRedirect) {
      this.#localStoreService.removeItem(this.#beforeRedirectKey);
    }

    return urlBeforeRedirect;
  }

  signIn(beforeRedirectUrl?: string) {
    this.#localStoreService.removeItem(this.#beforeRedirectKey);

    if (beforeRedirectUrl) {
      this.#localStoreService.setItem(
        this.#beforeRedirectKey,
        beforeRedirectUrl
      );
    }

    window.location.href = `http://localhost:3000/api/auth/login`; // express-openid-connect handles this
  }

  signInTab() {
    this.#localStoreService.setItem(this.#separateWindow, JSON.stringify(true));

    window.open('http://localhost:3000/api/auth/login', '_blank')?.focus();

    /** TODO use CrossTabSyncService instead of localstorage and keep LS as fallback */
    return new Promise((resolve, reject) => {
      const storageEventHandler = (event: StorageEvent) => {
        console.log('Storage Event Origin:', event, (event as any).origin);

        // Check if it's the key we are waiting for
        if (
          event.key === this.#separateWindow &&
          event.url.includes(window.origin)
        ) {
          clearTimeout(timeoutId);
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
  }

  deleteAuth0User() {
    console.log('implement delete auth0 user');
  }
}
