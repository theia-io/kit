import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeatAuth0Events } from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Store } from '@ngrx/store';
import { Observable, catchError, throwError } from 'rxjs';
import { Auth0Service } from './auth0.service';

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const router = inject(Router);
  const store = inject(Store);
  const auth0Service = inject(Auth0Service);

  return next(req).pipe(
    catchError((err) => {
      const httpResponseError = err instanceof HttpErrorResponse,
        unauthorized = err.status === 401,
        silentSignInExpected = err.status === 428,
        kitEndpoint = req.url.includes('api/kit');

      if (httpResponseError && kitEndpoint && silentSignInExpected) {
        console.log(
          '[authInterceptor] ->3: HTTP ERROR - silent sign in expected',
          router.url,
          auth0Service.getTest()
        );

        auth0Service.signIn(router.url);
        router.navigate([`/${APP_PATH_STATIC_PAGES.SignInSemiSilent}`]);
      }

      // if to do it also for `kitEndpoint` then we get into infinite loop
      if (httpResponseError && !kitEndpoint && unauthorized) {
        console.info(
          '[authInterceptor] ->3.2: user needs authentication, started auth flow',
          req
        );
        store.dispatch(
          FeatAuth0Events.setAuthState({
            user: null,
            account: null,
            profiles: [],
          })
        );
        // store.dispatch(FeatUserApiActions.setUser({ user: null }));
        store.dispatch(FeatAuth0Events.tryAuth());
      }

      return throwError(() => err);
    })
  );
}
