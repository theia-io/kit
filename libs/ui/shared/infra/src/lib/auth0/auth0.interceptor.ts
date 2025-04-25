import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeatUserApiActions } from '@kitouch/kit-data';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Store } from '@ngrx/store';
import { Observable, catchError, of, throwError } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const router = inject(Router);
  const store = inject(Store);

  return next(req).pipe(
    catchError((err) => {
      console.error('[AuthInterceptor]: ', err);
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        req.url.includes('api/kit')
      ) {
        console.info(
          '[AuthInterceptor] silent logged in FAILED, PASS THROUGH',
          req
        );
        return throwError(() => err);
      }

      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.info('[AuthInterceptor] FAILED, REDIRECT', req);
        store.dispatch(FeatUserApiActions.setUser({ user: undefined }));
        router.navigate([`/s/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      return throwError(() => err);
    })
  );
}
