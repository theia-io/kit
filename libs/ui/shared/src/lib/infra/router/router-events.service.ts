import { Inject, inject, Injectable } from '@angular/core';
import { NavigationCancel, NavigationStart, Router } from '@angular/router';
import { Environment, ENVIRONMENT } from '@kitouch/ui/shared';
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterEventsService {
  #router = inject(Router);

  lastUrlBeforeCancelled$ = this.#router.events.pipe(
    filter(
      (event): event is NavigationCancel => event instanceof NavigationCancel
    ),
    switchMap(({ url: urlBeforeCancel }) =>
      this.#router.events.pipe(
        filter((v) => v instanceof NavigationStart),
        map(() => urlBeforeCancel),
        take(1)
      )
    ),
    startWith(undefined),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  constructor(@Inject(ENVIRONMENT) private environment: Environment) {
    if (!environment.production) {
      this.lastUrlBeforeCancelled$.subscribe((v) =>
        console.log('\n[ROUTE] LAST URL event', v)
      );
    }
  }
}
