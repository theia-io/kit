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

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err) => {
      console.log('[AuthInterceptor]: ', err);
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.log('[AuthInterceptor] INSIDE ');
        router.navigate([`/s/${APP_PATH_STATIC_PAGES.SignIn}`]);
      }

      return throwError(() => err);
    })
  );
}
