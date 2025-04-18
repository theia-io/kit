import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Experience, User } from '@kitouch/shared-models';

@Injectable({
  providedIn: 'root',
})
export class UserV2Service {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getUser$(userId: string) {
    return this.#http.get<User>(`${this.#env.api.kit}/user/${userId}`);
  }

  addUserExperience$(userId: string, experience: Experience) {
    return this.#http.put(
      `${this.#env.api.kit}/user/${userId}/experience`,
      experience
    );
  }

  deleteUserExperience$(userId: string, experienceId: Experience['id']) {
    return this.#http.delete(
      `${this.#env.api.kit}/user/${userId}/experience/${experienceId}`
    );
  }
}
