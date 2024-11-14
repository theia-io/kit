import { inject, Injectable } from '@angular/core';
import {
  clientDbFarewellCommentAdapter,
  ClientDBFarewellCommentResponse,
  dbClientFarewellCommentAdapter,
} from '@kitouch/feat-farewell-data';
import { Farewell, FarewellComment } from '@kitouch/shared-models';
import { DataSourceService, ENVIRONMENT } from '@kitouch/ui-shared';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellCommentsService extends DataSourceService {
  #env = inject(ENVIRONMENT);

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
    const commentRequest = clientDbFarewellCommentAdapter(reactionData);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellCommentResponse>('farewell-comments')
          .insertOne(commentRequest)
      ),
      map(({ insertedId }) => ({ ...commentRequest, _id: insertedId })),
      map((FarewellComment) => dbClientFarewellCommentAdapter(FarewellComment))
    );
  }

  batchFarewellComments(
    comments: Array<ClientDataType<FarewellComment>>
  ): Observable<Array<FarewellComment>> {
    const commentsRequest = comments.map(clientDbFarewellCommentAdapter);

    return this.db$().pipe(
      switchMap((db) =>
        db
          .collection<ClientDBFarewellCommentResponse>('farewell-comments')
          .insertMany(commentsRequest)
      ),
      map(({ insertedIds }) =>
        insertedIds.map((insertedId, idx) => ({
          ...commentsRequest[idx],
          _id: insertedId,
        }))
      ),
      map((farewellComments) =>
        farewellComments.map(dbClientFarewellCommentAdapter)
      )
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

  uploadFarewellCommentMedia(key: string, media: Blob) {
    return this.setBucketItem(this.#env.s3Config.farewellBucket, key, media);
  }
  /** Media, S3 */
  deleteFarewellCommentMedia(key: string) {
    return this.deleteBucketItem(this.#env.s3Config.farewellBucket, key);
  }
}
