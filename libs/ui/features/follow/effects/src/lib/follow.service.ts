import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowService {
  #http = inject(HttpClient);
  #env = inject(ENVIRONMENT);

  getColleaguesProfileSuggestions$(): Observable<Array<Profile>> {
    return this.#http.get<Array<Profile>>(`${this.#env.api.kit}/suggestion`);
  }
}
