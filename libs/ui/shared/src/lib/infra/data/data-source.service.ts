import { inject } from '@angular/core';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export class DataSourceService {
  #db$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) =>
      // currentUser?.mongoClient('data-kccpdqv').db('kitouch')
      currentUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    filter(Boolean),
    shareReplay(1)
  );

  #realmFunctions$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) => currentUser?.functions),
    filter(Boolean),
    shareReplay(1)
  );

  protected db$() {
    return this.#db$.pipe(take(1));
  }

  protected realmFunctions$() {
    return this.#realmFunctions$.pipe(take(1));
  }
}
