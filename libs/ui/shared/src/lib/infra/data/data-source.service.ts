import { inject } from '@angular/core';
import { filter, map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export class DataSourceService {
  protected db$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) =>
      // currentUser?.mongoClient('data-kccpdqv').db('kitouch')
    currentUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    filter(Boolean),
    shareReplay(1)
  );
}
