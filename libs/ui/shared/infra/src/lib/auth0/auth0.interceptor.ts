import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const router = inject(Router);
  return next(req).pipe(
    tap((res) => {
      console.log('[AuthInterceptor]: ', res);

      if (res instanceof HttpErrorResponse && res.status === 401) {
        return router.createUrlTree([`/s/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      return res;
    }),
    catchError((err) => {
      console.log('[AuthInterceptor]: ', err);
      return throwError(() => err);
    })
  );
}
