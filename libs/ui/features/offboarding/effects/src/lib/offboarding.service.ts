import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { ExpOffboarding, Profile } from '@kitouch/shared-models';

import { ClientDataType } from '@kitouch/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OffboardingV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getOffboardings(profileId: Profile['id']): Observable<Array<ExpOffboarding>> {
    return this.#http.get<Array<ExpOffboarding>>(
      `${this.#environment.api.offboardings}/profile/${profileId}`
    );
  }

  getOffboarding(id: string): Observable<ExpOffboarding | null> {
    return this.#http.get<ExpOffboarding>(
      `${this.#environment.api.offboardings}/${id}`
    );
  }

  createOffboarding(
    offboarding: ClientDataType<ExpOffboarding>
  ): Observable<ExpOffboarding> {
    return this.#http.post<ExpOffboarding>(
      `${this.#environment.api.offboardings}`,
      offboarding
    );
  }

  putOffboarding(offboarding: ExpOffboarding) {
    return this.#http.put<ExpOffboarding>(
      `${this.#environment.api.offboardings}/${offboarding.id}`,
      offboarding
    );
  }

  deleteOffboarding(id: ExpOffboarding['id']) {
    return this.#http.delete<ExpOffboarding>(
      `${this.#environment.api.offboardings}/${id}`
    );
  }
}
