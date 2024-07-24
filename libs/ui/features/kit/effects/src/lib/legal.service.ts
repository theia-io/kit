import { Injectable } from '@angular/core';
import { Legal } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LegalService extends DataSourceService {
  getCompanies$() {
    return this.db$().pipe(
      switchMap((db) => db.collection<Legal>('legal').find()),
    );
  }

  addCompanies$(companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    return this.db$().pipe(
      switchMap((db) => db.collection('legal').insertMany(companies))
    );
  }
}
