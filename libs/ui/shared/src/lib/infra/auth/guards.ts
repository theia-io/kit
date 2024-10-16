import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { APP_PATH_STATIC_PAGES } from '../../constants';

/**
 * Checks if user is in RxJS (RAM) state. If it is not check
 * if Realm can resolve the user. If so it was refresh of the app
 * and user willis resolved by
 */
export const onlyForNotLoggedInGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.loggedInWithRealmUser$.pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        // we might want to get a last valid route in a future?
        return router.createUrlTree(['']);
      }

      return !isLoggedIn;
    })
  );
};

/**
 * Checks if user is in RxJS (RAM) state. If it is not check
 * if Realm can resolve the user. If so it was refresh of the app
 * and user willis resolved by
 */
export const onlyForLoggedInGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.loggedInWithRealmUser$.pipe(
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
  const authService = inject(AuthService);

  return authService.loggedInWithRealmUser$.pipe(
    switchMap(async (isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return of(true);
      }

      await authService.logInAnonymously();
      return of(true);
    })
  );
};
