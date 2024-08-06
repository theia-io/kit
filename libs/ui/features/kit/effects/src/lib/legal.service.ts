import { Injectable } from '@angular/core';
import { dbClientLegalAdapter } from '@kitouch/kit-data';
import { Legal } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { DBClientType } from '@kitouch/utils';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LegalService extends DataSourceService {
  getCompanies$() {
    return this.db$().pipe(
      switchMap((db) => db.collection<DBClientType<Legal>>('legal').find()),
      map((companies) => companies.map(dbClientLegalAdapter))
    );
  }

  addCompanies$(companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    return this.db$().pipe(
      switchMap((db) => db.collection('legal').insertMany(companies))
    );
  }
}
