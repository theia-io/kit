import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, tap } from 'rxjs';
import { RouterEventsService } from '../router/router-events.service';
import { AuthService } from './auth.service';

/**
 * Checks if user is in RxJS (RAM) state. If it is not check 
 * if Realm can resolve the user. If so it was refresh of the app 
 * and user willis resolved by 
 */
export const isLoggedInGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const routerEventsService = inject(RouterEventsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn$.pipe(
    tap((v) => console.log('from isLoggedInGuard', v)),
    map(async (isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        const user = await authService.tryGetAndRefreshUser();
        if (user) {
          isLoggedIn = true;
        }
      }

      if (!isLoggedIn) {
        routerEventsService.latestBeforeRedirect$.next(state.url);
        router.navigate(['/join']);
      }

      return isLoggedIn;
    })
  );
};
