import { inject } from '@angular/core';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';

export class DataSourceService {
  #anonymousdb$ = inject(AuthService).anonymousUser$.pipe(
    map((anonymousUser) =>
      anonymousUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  #db$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) =>
      currentUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  /** @deprecated Call db$() instead and query DB. */
  #realmFunctions$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) => currentUser?.functions),
    filter(Boolean),
    shareReplay(1)
  );

  /** Returns only logged in user Realm SDK DB reference */
  protected db$() {
    return this.#db$.pipe(take(1), filter(Boolean));
  }

  /** Returns Logged in or fall back to anonymous user Realm SDK DB reference */
  protected allowAnonymousDb$() {
    return this.#db$.pipe(
      switchMap((db) => (db ? of(db) : this.#anonymousdb$)),
      take(1),
      filter(Boolean)
    );
  }

  /** @deprecated Use `db$()` or `allowAnonymousDb$()` for query DB. Only calling `genericFunction` API is still allowed  */
  protected realmFunctions$() {
    return this.#realmFunctions$.pipe(take(1));
  }
}
