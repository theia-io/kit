import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import { from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellMediaService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  uploadFarewellMedia(key: string, blob: Blob) {
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
          }
        )
      )
    );
  }

  deleteFarewellMedia(key: string) {
    const { media } = this.#env.api;

    return this.#http.delete(`${media}/farewell`, {
      params: {
        name: key,
      },
    });
  }
}
