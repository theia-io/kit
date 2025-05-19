import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { ContractUploadedMedia, Profile } from '@kitouch/shared-models';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getProfiles(profiles: Array<Profile['id']>): Observable<Array<Profile>> {
    return this.#http.get<Array<Profile>>(`${this.#env.api.kit}/profiles`, {
      params: {
        profiles: profiles.join(','),
      },
    });
  }

  getProfileFollowers(profile: Profile['id']): Observable<Array<Profile>> {
    return this.#http.get<Array<Profile>>(
      `${this.#env.api.kit}/followers/${profile}`
    );
  }

  put(profile: Profile): Observable<Profile> {
    return this.#http.put<Profile>(`${this.#env.api.kit}/profiles`, profile);
  }

  uploadProfilePicture(key: string, media: Blob) {
    return from(media.arrayBuffer()).pipe(
      switchMap((fileArrayBuffer) =>
        this.#http.post<ContractUploadedMedia>(
          `${this.#env.api.media}/profile`,
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
}
