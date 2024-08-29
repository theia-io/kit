import { inject, Injectable } from '@angular/core';
import {
  ClientDBFarewellAnalyticsRequest,
  ClientDBFarewellAnalyticsResponse,
  ClientDBFarewellMediaRequest,
  ClientDBFarewellMediaResponse,
  ClientDBFarewellRequest,
  ClientDBFarewellResponse,
  dbClientFarewellAdapter,
  dbClientFarewellAnalyticsAdapter,
  dbClientFarewellMediaAdapter,
} from '@kitouch/feat-farewell-data';
import {
  Farewell,
  FarewellAnalytics,
  FarewellMedia,
  Profile,
} from '@kitouch/shared-models';
import { DataSourceService, ENVIRONMENT } from '@kitouch/ui-shared';
import {
  clientDBGenerateTimestamp,
  ClientDBRequestPartialType,
  DBClientType,
} from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellService extends DataSourceService {
  #env = inject(ENVIRONMENT);

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

  createFarewell({
    profile,
    title,
    content,
  }: {
    profile: Profile;
    title: string;
    content: string;
  }): Observable<Farewell> {
    const farewell: ClientDBFarewellRequest = {
      profile,
      title,
      content,
      ...clientDBGenerateTimestamp(),
    };

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
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell').updateOne(
          { _id: new BSON.ObjectId(id) },
          {
            $set: {
              ...rest,
            },
          }
        )
      ),
      map(() => ({ ...rest, id }))
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

  /** Media, S3 */
  uploadFarewellMedia(key: string, media: Blob) {
    return this.setBucketItem(this.#env.s3Config.farewellBucket, key, media);
  }

  /** Returns medias for single farewell */
  getMediasFarewell(farewellId: string) {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellMediaResponse>('farewell-media')
          .find({ farewellId: new BSON.ObjectId(farewellId) })
      ),
      map((farewellMediasDb) =>
        farewellMediasDb
          ? farewellMediasDb.map(dbClientFarewellMediaAdapter)
          : null
      )
    );
  }

  /** Returns medias for multiple farewells */
  getMediasFarewells(farewellIds: Array<string>) {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellMediaResponse>('farewell-media')
          .find({
            farewellId: {
              $in: farewellIds.map(
                (farewellId) => new BSON.ObjectId(farewellId)
              ),
            },
          })
      ),
      map((farewellsMediasDb) =>
        farewellsMediasDb
          ? farewellsMediasDb.map(dbClientFarewellMediaAdapter)
          : null
      )
    );
  }

  postMediasFarewell(medias: Array<ClientDBRequestPartialType<FarewellMedia>>) {
    const mediasReq: Array<ClientDBFarewellMediaRequest> = medias.map(
      ({ farewellId, profileId, url }) => ({
        farewellId: new BSON.ObjectId(farewellId),
        profileId: new BSON.ObjectId(profileId),
        url,
        ...clientDBGenerateTimestamp(),
      })
    );

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellMediaResponse>('farewell-media')
          .insertMany(mediasReq)
      ),
      map(({ insertedIds }) =>
        insertedIds
          ? mediasReq.map((mediasReq, idx) =>
              dbClientFarewellMediaAdapter({
                ...mediasReq,
                // TODO verify that indexing is correct BEFORE implementing deleting media's
                _id: insertedIds[idx],
              })
            )
          : null
      )
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
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell-analytics').updateOne(
          { _id: new BSON.ObjectId(analytics.id) },
          {
            $set: {
              ...rest,
            },
          }
        )
      ),
      map(() => analytics)
    );
  }
}
