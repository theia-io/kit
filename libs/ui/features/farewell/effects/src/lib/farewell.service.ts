import { Injectable } from '@angular/core';
import { Farewell, Profile } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellService extends DataSourceService {
  getFarewells(): Observable<Array<Farewell>> {
    return this.db$().pipe(
      switchMap((db) => db.collection<Farewell>('farewell').find()),
      map((farewells) => farewells.map(({_id, ...rest}) => ({...rest, _id: _id.toString()})))
    );
  }

  createFarewell({profile, title, content}: {profile: Profile, title: string, content: string}): Observable<Farewell> {
    const farewell: Omit<Farewell, '_id'> = {
      profile,
      title,
      content,
      viewed: 0,
      timestamp: {
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    };

    return this.db$().pipe(
      switchMap((db) =>
        db.collection<Farewell>('farewell').insertOne({
          ...farewell,
        })
      ),
      map(({ insertedId }) => ({ ...farewell, _id: insertedId }))
    );
  }

  putFarewell({_id, ...rest}: Farewell) {
    return this.db$().pipe(
      switchMap((db) => db.collection<Farewell>('farewell').updateOne(
        { _id: new BSON.ObjectId(_id) },
        {
          $set: {
            ...rest
          }
        }
    )),
      map(() => ({...rest, _id}))
    );
  }
}
