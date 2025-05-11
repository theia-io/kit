import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  ContractUploadedMedia,
  Farewell,
  FarewellComment,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellCommentsService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getFarewellComments(
    farewellId: Farewell['id'],
  ): Observable<Array<FarewellComment>> {
    return this.#http.get<Array<FarewellComment>>(
      `${this.#env.api.farewellComments}/${farewellId}`,
    );
  }

  postFarewellComment(
    farewellComment: ClientDataType<FarewellComment>,
  ): Observable<FarewellComment> {
    return this.#http.post<FarewellComment>(
      `${this.#env.api.farewellComments}`,
      farewellComment,
    );
  }

  batchFarewellComments(
    comments: Array<ClientDataType<FarewellComment>>,
  ): Observable<Array<FarewellComment>> {
    return this.#http.post<Array<FarewellComment>>(
      `${this.#env.api.farewellComments}/batch`,
      comments,
    );
  }

  deleteFarewellComment(id: FarewellComment['id']) {
    return this.#http.delete<Array<FarewellComment>>(
      `${this.#env.api.farewellComments}/${id}`,
    );
  }

  uploadFarewellCommentMedia(key: string, blob: Blob) {
    const { media } = this.#env.api;

    return from(blob.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${media}/farewell`,
          fileArrayBuffer,
          {
            headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
            params: {
              name: key,
            },
          },
        ),
      ),
    );
  }

  deleteFarewellCommentMedia(key: string) {
    const { media } = this.#env.api;
    return this.#http.delete(`${media}/farewell`, {
      params: {
        name: key,
      },
    });
  }
}
