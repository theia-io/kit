import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor', req.url);
    return next.handle(req).pipe(
      tap((err) => {
        console.log('[AuthInterceptor]: ', err);

        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }

          // this.#router.navigate(['login']);
        }
      }),
      catchError((err) => {
        console.log('[AuthInterceptor]: ', err);
        return throwError(() => err);
      })
    );
  }
}
