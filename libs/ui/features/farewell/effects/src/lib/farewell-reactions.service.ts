import { Injectable } from '@angular/core';
import {
  clientDbFarewellReactionAdapter,
  ClientDBFarewellReactionResponse,
  dbClientFarewellReactionAdapter,
} from '@kitouch/feat-farewell-data';
import { Farewell, FarewellReaction } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellReactionsService extends DataSourceService {
  getFarewellReactions(
    farewellId: Farewell['id']
  ): Observable<Array<FarewellReaction>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellReactionResponse>('farewell-reactions')
          .find({ farewellId: farewellId })
      ),
      map((reactions) => reactions.map(dbClientFarewellReactionAdapter))
    );
  }

  postFarewellReaction(
    reactionData: ClientDataType<FarewellReaction>
  ): Observable<FarewellReaction> {
    const reactionRequest = clientDbFarewellReactionAdapter(reactionData);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellReactionResponse>('farewell-reactions')
          .insertOne(reactionRequest)
      ),
      map(({ insertedId }) => ({ ...reactionRequest, _id: insertedId })),
      map((farewellReaction) =>
        dbClientFarewellReactionAdapter(farewellReaction)
      )
    );
  }

  deleteFarewellReaction(id: FarewellReaction['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellReactionResponse>('farewell-reactions')
          .deleteOne({
            _id: new BSON.ObjectId(id),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
