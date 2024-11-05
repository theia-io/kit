import { Injectable } from '@angular/core';
import {
  ClientDBKudoBoardAnalyticsRequest,
  ClientDBKudoBoardAnalyticsResponse,
  dbClientKudoBoardAnalyticsAdapter,
} from '@kitouch/data-kudoboard';

import { KudoBoard, KudoBoardAnalytics } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import {
  ClientDataType,
  clientDBGenerateTimestamp,
  DBClientType,
} from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardAnalyticsService extends DataSourceService {
  getAnalyticsKudoBoards(kudoBoardIds: Array<string>) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardAnalyticsResponse>('kudoboard-analytics')
          .find({
            kudoBoardId: {
              $in: kudoBoardIds.map(
                (kudoBoardId) => new BSON.ObjectId(kudoBoardId)
              ),
            },
          })
      ),
      map((analytics) => analytics.map(dbClientKudoBoardAnalyticsAdapter))
    );
  }

  getAnalyticsKudoBoard(kudoBoardId: string) {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<KudoBoardAnalytics>>('kudoboard-analytics')
          .find({ kudoBoardId: new BSON.ObjectId(kudoBoardId) })
      ),
      map((kudoboardAnalyticsDb) =>
        kudoboardAnalyticsDb
          ? kudoboardAnalyticsDb.map(dbClientKudoBoardAnalyticsAdapter)
          : null
      )
    );
  }

  postAnalyticsKudoBoard(analytics: ClientDataType<KudoBoardAnalytics>) {
    const kudoboardAnalytics: ClientDBKudoBoardAnalyticsRequest = {
      ...analytics,
      kudoBoardId: new BSON.ObjectId(analytics.kudoBoardId),
      ...clientDBGenerateTimestamp(),
    };

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardAnalyticsResponse>('kudoboard-analytics')
          .insertOne(kudoboardAnalytics)
      ),
      map(({ insertedId }) =>
        insertedId
          ? dbClientKudoBoardAnalyticsAdapter({
              ...kudoboardAnalytics,
              _id: insertedId,
            })
          : null
      )
    );
  }

  deleteAnalyticsKudoBoard(kudoBoardId: KudoBoard['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardAnalyticsResponse>('kudoboard-analytics')
          .deleteMany({
            kudoBoardId: new BSON.ObjectId(kudoBoardId),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
