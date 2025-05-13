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

// TODO @FIXME is not resolved in time
export const onlyForNotLoggedInGuard = () => {
  const router = inject(Router);

  return inject(Auth0Service).loggedInUser$.pipe(
    take(1),
    map((user) => !!user),
    map((isLoggedIn: boolean) => {
      console.info('onlyForNotLoggedInGuard', isLoggedIn);
      if (isLoggedIn) {
        // we might want to get a last valid route in a future?
        return router.createUrlTree(['']);
      }

      return true;
    })
  );
};

export const onlyForLoggedInGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(Auth0Service);
  const store = inject(Store);

  return authService.loggedIn$.pipe(
    take(1),
    tap((v) =>
      console.info(
        '[onlyForLoggedInGuard] ->1: Check if logged in: %s; url: %s',
        v,
        router.url
      )
    ),
    switchMap((isLoggedIn) =>
      isLoggedIn
        ? of(isLoggedIn)
        : authService.getCurrentSessionAccountUserProfiles().pipe(
            tap((v) =>
              console.info('[onlyForLoggedInGuard] ->2: Resolved user', v)
            ),
            tap((data) => {
              store.dispatch(FeatAuth0Events.setAuthState({ ...data }));
            }),
            map((res) => !!res as boolean),
            catchError((err) => {
              console.info(
                '[onlyForLoggedInGuard] ->2.1: user resolution failed for protected route',
                err
              );
              return of(false);
            })
          )
    ),
    map((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        console.info(
          '[onlyForLoggedInGuard] ->3: No user, redirecting to sign in'
        );
        store.dispatch(FeatUserApiActions.setUser({ user: null }));
        return router.navigate([`/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      console.info('[onlyForLoggedInGuard] ->4: Logged in', isLoggedIn);
      return isLoggedIn;
    })
  );
};
