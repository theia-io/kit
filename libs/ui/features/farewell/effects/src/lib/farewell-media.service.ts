import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT, S3Service } from '@kitouch/shared-infra';

@Injectable({ providedIn: 'root' })
export class FarewellMediaService {
  #env = inject(ENVIRONMENT);
  #s3Service = inject(S3Service);

  uploadFarewellMedia(key: string, media: Blob) {
    return this.#s3Service.setBucketItem(
      this.#env.s3Config.farewellBucket,
      key,
      media
    );
  }
  /** Media, S3 */
  deleteFarewellMedia(key: string) {
    return this.#s3Service.deleteBucketItem(
      this.#env.s3Config.farewellBucket,
      key
    );
  }
}
