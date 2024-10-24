import { Injectable } from '@angular/core';
import {
  clientDbFarewellCommentAdapter,
  ClientDBFarewellCommentResponse,
  dbClientFarewellCommentAdapter,
} from '@kitouch/feat-farewell-data';
import { Farewell, FarewellComment } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellCommentsService extends DataSourceService {
  getFarewellComments(
    farewellId: Farewell['id']
  ): Observable<Array<FarewellComment>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellCommentResponse>('farewell-comments')
          .find({ farewellId: new BSON.ObjectId(farewellId) })
      ),
      map((reactions) => reactions.map(dbClientFarewellCommentAdapter))
    );
  }

  postFarewellComment(
    reactionData: ClientDataType<FarewellComment>
  ): Observable<FarewellComment> {
    const reactionRequest = clientDbFarewellCommentAdapter(reactionData);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellCommentResponse>('farewell-comments')
          .insertOne(reactionRequest)
      ),
      map(({ insertedId }) => ({ ...reactionRequest, _id: insertedId })),
      map((FarewellComment) => dbClientFarewellCommentAdapter(FarewellComment))
    );
  }

  deleteFarewellComment(id: FarewellComment['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellCommentResponse>('farewell-comments')
          .deleteOne({
            _id: new BSON.ObjectId(id),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
