import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  ContractUploadedMedia,
  KudoBoard,
  KudoBoardComment,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardCommentsService {
  #environment = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getKudoBoardComments(
    kudoBoardId: KudoBoard['id']
  ): Observable<Array<KudoBoardComment>> {
    return this.#http.get<Array<KudoBoardComment>>(
      `${this.#environment.api.kudoboardComments}/${kudoBoardId}`
    );
  }

  createKudoBoardComment(
    kudoBoardComment: ClientDataType<KudoBoardComment>
  ): Observable<KudoBoardComment> {
    return this.#http.post<KudoBoardComment>(
      `${this.#environment.api.kudoboardComments}`,
      kudoBoardComment
    );
  }

  deleteKudoBoardComment(id: KudoBoardComment['id']) {
    return this.#http.delete<KudoBoard>(
      `${this.#environment.api.kudoboardComments}/${id}`
    );
  }

  uploadKudoBoardCommentMedia(key: string, blob: Blob) {
    const { media } = this.#environment.api;

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
    const { media } = this.#environment.api;
    return this.#http.delete(`${media}/kudoboard`, {
      params: {
        name: key,
      },
    });
  }
}
