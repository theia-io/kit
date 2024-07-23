import { Injectable } from '@angular/core';
import { Account } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { BSON } from 'realm-web';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends DataSourceService {
  deleteAccount$(accountId: Account['id']) {
    return this.db$.pipe(
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
