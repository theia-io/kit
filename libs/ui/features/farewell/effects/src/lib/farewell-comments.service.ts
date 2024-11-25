import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  clientDbFarewellCommentAdapter,
  ClientDBFarewellCommentResponse,
  dbClientFarewellCommentAdapter,
} from '@kitouch/feat-farewell-data';
import { DataSourceService, ENVIRONMENT } from '@kitouch/shared-infra';
import {
  ContractUploadedMedia,
  Farewell,
  FarewellComment,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellCommentsService extends DataSourceService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

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

  uploadFarewellCommentMedia(key: string, blob: Blob) {
    const { root, media } = this.#env.api;

    return from(blob.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${root}${media}/farewell`,
          fileArrayBuffer,
          {
            headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
            params: {
              name: key,
            },
          }
        )
      )
    );
  }

  /** Media, S3 */
  deleteFarewellCommentMedia(key: string) {
    const { root, media } = this.#env.api;
    // return this.deleteBucketItem(this.#env.s3Config.farewellBucket, key);
    return this.#http.delete(`${root}${media}/farewell`, {
      params: {
        name: key,
      },
    });
  }
}
