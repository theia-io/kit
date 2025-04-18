import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT, S3Service } from '@kitouch/shared-infra';

@Injectable({ providedIn: 'root' })
export class KudoBoardMediaService {
  #env = inject(ENVIRONMENT);
  #s3Service = inject(S3Service);

  uploadKudoBoardMedia(key: string, media: Blob) {
    return this.#s3Service.setBucketItem(
      this.#env.s3Config.kudoBoardBucket,
      key,
      media
    );
  }
  /** Media, S3 */
  deleteKudoBoardMedia(key: string) {
    return this.#s3Service.deleteBucketItem(
      this.#env.s3Config.kudoBoardBucket,
      key
    );
  }
}
