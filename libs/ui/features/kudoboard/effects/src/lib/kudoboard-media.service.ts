import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import { from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardMediaService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  uploadKudoBoardMedia(key: string, media: Blob) {
    return from(media.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${this.#env.api.media}/kudoboard`,
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

    // return this.#s3Service.setBucketItem(
    //   this.#env.s3Config.kudoBoardBucket,
    //   key,
    //   media
    // );
  }

  deleteKudoBoardMedia(key: string) {
    const { media } = this.#env.api;

    return this.#http.delete(`${media}/kudoboard`, {
      params: {
        name: key,
      },
    });

    // return this.#s3Service.deleteBucketItem(
    //   this.#env.s3Config.kudoBoardBucket,
    //   key
    // );
  }
}
