import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../environments';

export function credentialsInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const environment = inject(ENVIRONMENT);

  if (req.url.startsWith(environment.api.root)) {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req);
}
