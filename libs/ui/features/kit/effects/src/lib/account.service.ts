import { Injectable } from '@angular/core';
import { Account } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { BSON } from 'realm-web';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends DataSourceService {
  deleteAccount$(accountId: Account['id']) {
    return this.db$.pipe(
      concatMap((db) =>
        from([
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
