import { Injectable } from '@angular/core';
import { DataSourceService } from '@kitouch/shared-infra';
import { Account } from '@kitouch/shared-models';
import { BSON } from 'realm-web';
import { forkJoin } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends DataSourceService {
  deleteAccount$(accountId: Account['id']) {
    return this.db$().pipe(
      take(1),
      switchMap((db) =>
        forkJoin([
          db
            .collection('account')
            .deleteOne({ _id: new BSON.ObjectId(accountId) }),
          db
            .collection('user')
            .deleteOne({ accountId: new BSON.ObjectId(accountId) }),
        ])
      )
    );
  }
}
