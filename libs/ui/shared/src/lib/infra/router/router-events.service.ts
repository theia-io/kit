import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationStart, Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterEventsService {
  #router = inject(Router);

  latestBeforeRedirect$ = new BehaviorSubject<string>('');

  lastUrlBeforeCancelled$ = this.#router.events.pipe(
    filter((event): event is NavigationCancel => event instanceof NavigationCancel),
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

  #lastUrlBeforeCancelledSub = this.lastUrlBeforeCancelled$.subscribe(v => console.log("\nLAST URL event", v));
}
