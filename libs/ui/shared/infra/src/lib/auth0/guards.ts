import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { FeatAuth0Events, FeatUserApiActions } from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take, tap } from 'rxjs';
import { Auth0Service } from './auth0.service';

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

      return true;
    }),
  );
};

export const onlyForLoggedInGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(Auth0Service);
  const store = inject(Store);

  return authService.loggedInUser$.pipe(
    take(1),
    map((user) => !!user),
    switchMap((isLoggedIn) =>
      isLoggedIn
        ? of(isLoggedIn)
        : authService.getCurrentSessionAccountUserProfiles().pipe(
            tap((data) => {
              store.dispatch(FeatAuth0Events.setAuthState({ ...data }));
            }),
            map((res) => !!res as boolean),
            catchError((err) => {
              console.info('[Auth guard] silent sing-in failed', err);
              return of(false);
            }),
          ),
    ),
    map((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        console.info('INSIDE onlyForLoggedInGuard REDIRECT');
        store.dispatch(FeatUserApiActions.setUser({ user: undefined }));
        return router.navigate([`/s/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      return isLoggedIn;
    }),
  );
};
