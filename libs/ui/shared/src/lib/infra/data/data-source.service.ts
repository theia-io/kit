import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Legal } from '@kitouch/shared/models';

@Injectable({ providedIn: 'root' })
export class DataSourceService {
  #db$ = inject(AuthService).realmUser$.pipe(
    map((currentUser) => currentUser?.mongoClient('AtlasCluster').db('kitouch')),
    filter(Boolean),
    shareReplay(1)
  );

  getCompanies$() {
    return this.#db$.pipe(
        switchMap(db => db.collection<Legal>('legal').find())
    )
  }
}
