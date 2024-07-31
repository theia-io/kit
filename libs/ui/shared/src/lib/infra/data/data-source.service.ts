import { inject } from '@angular/core';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';

export class DataSourceService {
  #anonymousdb$ = inject(AuthService).anonymousUser$.pipe(
    map((anonymousUser) =>
      // currentUser?.mongoClient('data-kccpdqv').db('kitouch')
      anonymousUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  #db$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) =>
      // currentUser?.mongoClient('data-kccpdqv').db('kitouch')
      currentUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  #realmFunctions$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) => currentUser?.functions),
    filter(Boolean),
    shareReplay(1)
  );

  protected db$() {
    return this.#db$.pipe(
      take(1),
      switchMap((db) => db ? of(db) : this.#anonymousdb$),
      filter(Boolean)
    );
  }

  protected anonymousDb$() {
    return this.#anonymousdb$.pipe(take(1));
  }

  protected realmFunctions$() {
    return this.#realmFunctions$.pipe(take(1));
  }
}
