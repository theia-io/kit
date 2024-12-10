import { inject, Injectable } from '@angular/core';
import { DataSourceService, ENVIRONMENT } from '@kitouch/shared-infra';

@Injectable({ providedIn: 'root' })
export class KudoBoardMediaService extends DataSourceService {
  #env = inject(ENVIRONMENT);

  uploadKudoBoardMedia(key: string, media: Blob) {
    return this.setBucketItem(this.#env.s3Config.kudoBoardBucket, key, media);
  }
  /** Media, S3 */
  deleteKudoBoardMedia(key: string) {
    return this.deleteBucketItem(this.#env.s3Config.kudoBoardBucket, key);
  }
}
