import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { RouterEventsService } from '../router/router-events.service';
import { AuthService } from './auth.service';

/**
 * Checks if user is in RxJS (RAM) state. If it is not check
 * if Realm can resolve the user. If so it was refresh of the app
 * and user willis resolved by
 */
export const onlyForNotLoggedInGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const routerEventsService = inject(RouterEventsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log('\n[Auth GUARD] NOT LOGGED IN:', router.url);

  return authService.isHardLoggedIn$.pipe(
    map((isLoggedIn: boolean) => {
      console.log('[Auth GUARD] NOT LOGGED IN:', isLoggedIn);

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
export const onlyForLoggedInGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const routerEventsService = inject(RouterEventsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log('\n[Auth GUARD] LOGGED IN:');

  return authService.isHardLoggedIn$.pipe(
    map((isLoggedIn: boolean) => {
      console.log('\n[Auth GUARD] LOGGED IN:', isLoggedIn);
      if (!isLoggedIn) {
        return router.createUrlTree(['/sign-in']);
      }

      return isLoggedIn;
    })
  );
};
