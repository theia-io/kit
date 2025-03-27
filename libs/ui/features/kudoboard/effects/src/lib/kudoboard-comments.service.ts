import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  clientDbKudoBoardCommentAdapter,
  ClientDBKudoBoardCommentResponse,
  dbClientKudoBoardCommentAdapter,
} from '@kitouch/data-kudoboard';
import { DataSourceService, ENVIRONMENT } from '@kitouch/shared-infra';
import {
  ContractUploadedMedia,
  KudoBoard,
  KudoBoardComment,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardCommentsService extends DataSourceService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

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

  uploadKudoBoardCommentMedia(key: string, blob: Blob) {
    const { media } = this.#env.api;

    return from(blob.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${media}/kudoboard`,
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
  deleteKudoBoardCommentMedia(key: string) {
    const { media } = this.#env.api;
    return this.#http.delete(`${media}/kudoboard`, {
      params: {
        name: key,
      },
    });
  }
}
