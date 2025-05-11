import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Legal } from '@kitouch/shared-models';

@Injectable({
  providedIn: 'root',
})
export class LegalService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getCompanies$() {
    return this.#http.get<Array<Legal>>(`${this.#env.api.kit}/legal`);
  }

  addCompanies$(companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    return this.#http.post<Array<Legal>>(
      `${this.#env.api.kit}/legal`,
      companies,
    );
  }
}
