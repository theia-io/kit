import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Account, Auth0User, Profile, User } from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth0DataService {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getAccountUserProfiles(
    user: Auth0User
  ): Observable<{ account: Account; user: User; profiles: Array<Profile> }> {
    return this.#http.get<{
      account: Account;
      user: User;
      profiles: Array<Profile>;
    }>(`${this.#environment.api.kit}/entity`, {
      params: {
        email: user.email,
      },
    });
  }
}
