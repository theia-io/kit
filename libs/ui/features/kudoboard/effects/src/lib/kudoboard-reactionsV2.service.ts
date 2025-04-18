import { Injectable } from '@angular/core';

import { KudoBoard, KudoBoardReaction } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardReactionsService {
  getKudoBoardReactions(
    kudoBoardId: KudoBoard['id']
  ): Observable<Array<KudoBoardReaction>> {
    return of([] as any);
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
    //       .find({ kudoBoardId: new BSON.ObjectId(kudoBoardId) })
    //   ),
    //   map((reactions) => reactions.map(dbClientKudoBoardReactionAdapter))
    // );
  }

  postKudoBoardReaction(
    reactionData: ClientDataType<KudoBoardReaction>
  ): Observable<KudoBoardReaction> {
    return of({} as any);
    // const reactionRequest = clientDbKudoBoardReactionAdapter(reactionData);

    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
    //       .insertOne(reactionRequest)
    //   ),
    //   map(({ insertedId }) => ({ ...reactionRequest, _id: insertedId })),
    //   map((kudoboardReaction) =>
    //     dbClientKudoBoardReactionAdapter(kudoboardReaction)
    //   )
    // );
  }

  deleteKudoBoardReaction(id: KudoBoardReaction['id']) {
    return of({} as any);
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db
    //       .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
    //       .deleteOne({
    //         _id: new BSON.ObjectId(id),
    //       })
    //   ),
    //   map(({ deletedCount }) => deletedCount > 0)
    // );
  }
}
