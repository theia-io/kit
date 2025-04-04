import { Injectable } from '@angular/core';
import {
  clientDbFarewellAdapter,
  ClientDBFarewellAnalyticsRequest,
  ClientDBFarewellAnalyticsResponse,
  ClientDBFarewellResponse,
  dbClientFarewellAdapter,
  dbClientFarewellAnalyticsAdapter,
} from '@kitouch/feat-farewell-data';
import { DataSourceService } from '@kitouch/shared-infra';
import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import {
  ClientDataType,
  clientDBGenerateTimestamp,
  DBClientType,
} from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellService extends DataSourceService {
  getFarewells(profileId: string): Observable<Array<Farewell>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<Farewell>>('farewell')
          .find({ 'profile.id': profileId })
      ),
      map((farewells) => farewells.map(dbClientFarewellAdapter))
    );
  }

  getFarewell(farewellId: string): Observable<Farewell | null> {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<Farewell>>('farewell')
          .findOne({ _id: new BSON.ObjectId(farewellId) })
      ),
      map((farewell) => (farewell ? dbClientFarewellAdapter(farewell) : null))
    );
  }

  createFarewell(
    clientDbFarewell: ClientDataType<Farewell>
  ): Observable<Farewell> {
    const farewell = clientDbFarewellAdapter(clientDbFarewell);

    return this.db$().pipe(
      switchMap((db) =>
        db.collection<ClientDBFarewellResponse>('farewell').insertOne({
          ...farewell,
        })
      ),
      map(({ insertedId }) => ({ ...farewell, _id: insertedId })),
      map((farewell) => dbClientFarewellAdapter(farewell))
    );
  }

  putFarewell({ id, ...rest }: Farewell) {
    const update = {
      ...rest,
      timestamp: {
        ...rest.timestamp,
        updatedAt: new Date(Date.now()),
      },
    };

    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell').updateOne(
          { _id: new BSON.ObjectId(id) },
          {
            $set: update,
          }
        )
      ),
      map(() => ({ ...update, id }))
    );
  }

  deleteFarewell(id: Farewell['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell').deleteOne({
          _id: new BSON.ObjectId(id),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  /** Analytics */
  getAnalyticsFarewells(farewellIds: Array<string>) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellAnalyticsResponse>('farewell-analytics')
          .find({
            farewellId: {
              $in: farewellIds.map(
                (farewellId) => new BSON.ObjectId(farewellId)
              ),
            },
          })
      ),
      map((analytics) => analytics.map(dbClientFarewellAnalyticsAdapter))
    );
  }

  getAnalyticsFarewell(farewellId: string) {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<FarewellAnalytics>>('farewell-analytics')
          .findOne({ farewellId: new BSON.ObjectId(farewellId) })
      ),
      map((farewellAnalyticsDb) =>
        farewellAnalyticsDb
          ? dbClientFarewellAnalyticsAdapter(farewellAnalyticsDb)
          : null
      )
    );
  }

  postAnalyticsFarewell(farewellId: string) {
    const farewellAnalytics: ClientDBFarewellAnalyticsRequest = {
      farewellId: new BSON.ObjectId(farewellId),
      viewed: 0,
      ...clientDBGenerateTimestamp(),
    };

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellAnalyticsResponse>('farewell-analytics')
          .insertOne(farewellAnalytics)
      ),
      map(({ insertedId }) =>
        insertedId
          ? dbClientFarewellAnalyticsAdapter({
              ...farewellAnalytics,
              _id: insertedId,
            })
          : null
      )
    );
  }

  deleteAnalyticsFarewell(farewellId: string) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellAnalyticsResponse>('farewell-analytics')
          .deleteOne({
            farewellId: new BSON.ObjectId(farewellId),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  putAnalytics(analytics: FarewellAnalytics) {
    const { id, farewellId, ...rest } = analytics;
    const update = {
      ...rest,
      timestamp: {
        ...rest.timestamp,
        updatedAt: new Date(Date.now()),
      },
    };

    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell-analytics').updateOne(
          { _id: new BSON.ObjectId(analytics.id) },
          {
            $set: update,
          }
        )
      ),
      map(() => ({ ...update, id, farewellId }))
    );
  }
}
