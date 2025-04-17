import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT, S3Service } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);
  #s3Service = inject(S3Service);

  getProfiles(profiles: Array<Profile['id']>): Observable<Array<Profile>> {
    return this.#http.get<Array<Profile>>(`${this.#env.api.kit}/profiles`, {
      params: {
        profiles: profiles.join(','),
      },
    });
  }

  put(profile: Profile): Observable<Profile> {
    return this.#http.put<Profile>(`${this.#env.api.kit}/profiles`, profile);
  }

  uploadProfilePicture(key: string, media: Blob) {
    return this.#s3Service.setBucketItem(
      this.#env.s3Config.profileBucket,
      key,
      media
    );
  }
}
