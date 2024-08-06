import { Injectable } from '@angular/core';
import { dbClientFarewellAdapter } from '@kitouch/feat-farewell-data';
import { Farewell, Profile } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { DBClientType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellService extends DataSourceService {
  getFarewells(profileId: string): Observable<Array<Farewell>> {
    return this.allowAnonymousDb$().pipe(
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
    const farewell: Omit<Farewell, 'id'> = {
      profile,
      title,
      content,
      viewed: 0,
      timestamp: {
        createdAt: new Date(Date.now()),
      },
    };

    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Farewell>>('farewell').insertOne({
          ...farewell,
        })
      ),
      map(({ insertedId }) => ({ ...farewell, _id: insertedId })),
      map((farewell) => dbClientFarewellAdapter(farewell as any))
    );
  }

  putFarewell({ id, ...rest }: Farewell) {
    return this.allowAnonymousDb$().pipe(
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
}
