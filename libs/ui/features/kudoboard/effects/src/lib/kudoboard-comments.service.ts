import { Injectable } from '@angular/core';
import {
  ClientDBKudoBoardCommentResponse,
  dbClientKudoBoardCommentAdapter,
  clientDbKudoBoardCommentAdapter,
} from '@kitouch/data-kudoboard';
import { KudoBoard, KudoBoardComment } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardCommentsService extends DataSourceService {
  getKudoBoardComments(
    kudoBoardId: KudoBoard['id']
  ): Observable<Array<KudoBoardComment>> {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardCommentResponse>('kudoboard-comments')
          .find({ kudoBoardId: new BSON.ObjectId(kudoBoardId) })
      ),
      map((reactions) => reactions.map(dbClientKudoBoardCommentAdapter))
    );
  }

  postKudoBoardComment(
    reactionData: ClientDataType<KudoBoardComment>
  ): Observable<KudoBoardComment> {
    const reactionRequest = clientDbKudoBoardCommentAdapter(reactionData);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardCommentResponse>('kudoboard-comments')
          .insertOne(reactionRequest)
      ),
      map(({ insertedId }) => ({ ...reactionRequest, _id: insertedId })),
      map((KudoBoardComment) =>
        dbClientKudoBoardCommentAdapter(KudoBoardComment)
      )
    );
  }

  deleteKudoBoardComment(id: KudoBoardComment['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBKudoBoardCommentResponse>('kudoboard-comments')
          .deleteOne({
            _id: new BSON.ObjectId(id),
          })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }
}
