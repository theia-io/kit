import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import { from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OffboardingMediaService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  uploadOffboardingMedia(key: string, media: Blob) {
    return from(media.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${this.#env.api.media}/offboarding`,
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

  deleteOffboardingMedia(key: string) {
    const { media } = this.#env.api;

    return this.#http.delete(`${media}/offboarding`, {
      params: {
        name: key,
      },
    });
  }
}
