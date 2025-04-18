import { Injectable } from '@angular/core';

import { KudoBoard } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardService {
  getKudoBoards(profileId: string): Observable<Array<KudoBoard>> {
    return of([] as any);
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<DBClientType<KudoBoard>>('kudoboard')
    //       .find({ 'profile.id': profileId })
    //   ),
    //   map((kudoboards) => kudoboards.map(dbClientKudoBoardAdapter))
    // );
  }

  getKudoBoard(kudoBoardId: string): Observable<KudoBoard | null> {
    return of({} as any);
    // return this.allowAnonymousDb$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<DBClientType<KudoBoard>>('kudoboard')
    //       .findOne({ _id: new BSON.ObjectId(kudoBoardId) })
    //   ),
    //   map((kudoboard) =>
    //     kudoboard ? dbClientKudoBoardAdapter(kudoboard) : null
    //   )
    // );
  }

  createKudoBoard(kuboBoard: ClientDataType<KudoBoard>): Observable<KudoBoard> {
    return of({} as any);
    // const kuboBoardReq = clientDbKudoBoardAdapter(kuboBoard);
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<ClientDBKudoBoardResponse>('kudoboard')
    //       .insertOne(kuboBoardReq)
    //   ),
    //   map(({ insertedId }) => ({ ...kuboBoardReq, _id: insertedId })),
    //   map((kudoboard) => dbClientKudoBoardAdapter(kudoboard))
    // );
  }

  putKudoBoard({ id, profileId, timestamp, ...rest }: KudoBoard) {
    return of({} as any);
    // const withUpdatedTime = {
    //   ...rest,
    //   profileId: profileId ? new BSON.ObjectId(profileId) : null,
    //   timestamp: {
    //     createdAt: timestamp.createdAt,
    //     updatedAt: getNow(),
    //   },
    // };

    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection<ClientDBKudoBoardResponse>('kudoboard').updateOne(
    //       { _id: new BSON.ObjectId(id) },
    //       {
    //         $set: withUpdatedTime,
    //       }
    //     )
    //   ),
    //   map(() => ({
    //     ...withUpdatedTime,
    //     profileId,
    //     id,
    //   }))
    // );
  }

  deleteKudoBoard(id: KudoBoard['id']) {
    return of({} as any);
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection<ClientDBKudoBoardResponse>('kudoboard').deleteOne({
    //       _id: new BSON.ObjectId(id),
    //     })
    //   ),
    //   map(({ deletedCount }) => deletedCount > 0)
    // );
  }
}
