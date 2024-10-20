import { inject, Injectable } from '@angular/core';
import { DataSourceService, ENVIRONMENT } from '@kitouch/ui-shared';

@Injectable({ providedIn: 'root' })
export class FarewellMediaService extends DataSourceService {
  #env = inject(ENVIRONMENT);

  uploadFarewellMedia(key: string, media: Blob) {
    return this.setBucketItem(this.#env.s3Config.farewellBucket, key, media);
  }
  /** Media, S3 */
  deleteFarewellMedia(key: string) {
    return this.deleteBucketItem(this.#env.s3Config.farewellBucket, key);
  }
}
