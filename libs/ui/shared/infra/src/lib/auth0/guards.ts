import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { map, of, switchMap, take } from 'rxjs';
import { Auth0Service } from './auth0.service';

/**
 * Checks if user is in RxJS (RAM) state. If it is not check
 * if Realm can resolve the user. If so it was refresh of the app
 * and user willis resolved by
 */
export const onlyForNotLoggedInGuard = () => {
  const router = inject(Router);

  return inject(Auth0Service).loggedInUser$.pipe(
    take(1),
    map((user) => !!user),
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        // we might want to get a last valid route in a future?
        return router.createUrlTree(['']);
      }

      return !isLoggedIn;
    })
  );
};

export const onlyForLoggedInGuard = () => {
  const router = inject(Router);

  return inject(Auth0Service).loggedInUser$.pipe(
    take(1),
    map((user) => !!user),
    map((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        return router.createUrlTree([`/s/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      return isLoggedIn;
    })
  );
};

/**
 * This function will make sure that there is logged in (Authorized) user
 * or will log in current session anonymously (this is because this page
 * need read data from MongoDB)
 */
export const onlyForLoggedInOrAnonymouslyLoggedInGuard = () => {
  return inject(Auth0Service).loggedInUser$.pipe(
    take(1),
    map((user) => !!user),
    switchMap(async (isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return of(true);
      }

      return of(true);
    })
  );
};
