import { Injectable } from '@angular/core';
import { Legal } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui/shared';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LegalService extends DataSourceService {
  getCompanies$() {
    return this.db$().pipe(
      switchMap((db) => db.collection<Legal>('legal').find()),
      map(
        (companies) =>
          new Map(companies.map((company) => [company.alias, company]))
      ),
      /** @FIXME move this check to DB and ensure on that level that company alias is unique */
      map((companiesMap) => [...companiesMap.values()])
    );
  }

  addCompanies$(companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    return this.db$().pipe(
      switchMap((db) => db.collection('legal').insertMany(companies))
    );
  }
}
