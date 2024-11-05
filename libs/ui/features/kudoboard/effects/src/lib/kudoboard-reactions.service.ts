import { Injectable } from '@angular/core';
import {
  ClientDBKudoBoardReactionResponse,
  dbClientKudoBoardReactionAdapter,
  clientDbKudoBoardReactionAdapter,
} from '@kitouch/data-kudoboard';

import { KudoBoard, KudoBoardReaction } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardReactionsService extends DataSourceService {
  getKudoBoardReactions(
    kudoBoardId: KudoBoard['id']
  ): Observable<Array<KudoBoardReaction>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
          .find({ kudoBoardId: new BSON.ObjectId(kudoBoardId) })
      ),
      map((reactions) => reactions.map(dbClientKudoBoardReactionAdapter))
    );
  }

  postKudoBoardReaction(
    reactionData: ClientDataType<KudoBoardReaction>
  ): Observable<KudoBoardReaction> {
    const reactionRequest = clientDbKudoBoardReactionAdapter(reactionData);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
          .insertOne(reactionRequest)
      ),
      map(({ insertedId }) => ({ ...reactionRequest, _id: insertedId })),
      map((kudoboardReaction) =>
        dbClientKudoBoardReactionAdapter(kudoboardReaction)
      )
    );
  }

  deleteKudoBoardReaction(id: KudoBoardReaction['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardReactionResponse>('kudoboard-reactions')
          .deleteOne({
            _id: new BSON.ObjectId(id),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
