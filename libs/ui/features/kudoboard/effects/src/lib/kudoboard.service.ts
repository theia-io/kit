import { Injectable } from '@angular/core';
import {
  clientDbKudoBoardAdapter,
  ClientDBKudoBoardResponse,
  dbClientKudoBoardAdapter,
} from '@kitouch/data-kudoboard';

import { KudoBoard } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { ClientDataType, DBClientType, getNow } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardService extends DataSourceService {
  getKudoBoards(profileId: string): Observable<Array<KudoBoard>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<KudoBoard>>('kudoboard')
          .find({ 'profile.id': profileId })
      ),
      map((kudoboards) => kudoboards.map(dbClientKudoBoardAdapter))
    );
  }

  getKudoBoard(kudoBoardId: string): Observable<KudoBoard | null> {
    return this.allowAnonymousDb$().pipe(
      switchMap((db) =>
        db
          .collection<DBClientType<KudoBoard>>('kudoboard')
          .findOne({ _id: new BSON.ObjectId(kudoBoardId) })
      ),
      map((kudoboard) =>
        kudoboard ? dbClientKudoBoardAdapter(kudoboard) : null
      )
    );
  }

  createKudoBoard(kuboBoard: ClientDataType<KudoBoard>): Observable<KudoBoard> {
    const kuboBoardReq = clientDbKudoBoardAdapter(kuboBoard);
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardResponse>('kudoboard')
          .insertOne(kuboBoardReq)
      ),
      map(({ insertedId }) => ({ ...kuboBoardReq, _id: insertedId })),
      map((kudoboard) => dbClientKudoBoardAdapter(kudoboard))
    );
  }

  putKudoBoard({ id, profileId, timestamp, ...rest }: KudoBoard) {
    const withUpdatedTime = {
      ...rest,
      profileId: profileId ? new BSON.ObjectId(profileId) : null,
      timestamp: {
        updatedAt: getNow(),
      },
    };

    return this.db$().pipe(
      switchMap((db) =>
        db.collection<ClientDBKudoBoardResponse>('kudoboard').updateOne(
          { _id: new BSON.ObjectId(id) },
          {
            $set: withUpdatedTime,
          }
        )
      ),
      map(() => ({
        ...withUpdatedTime,
        timestamp: { ...timestamp, ...withUpdatedTime.timestamp },
        profileId,
        id,
      }))
    );
  }

  deleteKudoBoard(id: KudoBoard['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<ClientDBKudoBoardResponse>('kudoboard').deleteOne({
          _id: new BSON.ObjectId(id),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
