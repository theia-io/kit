import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Account } from '@kitouch/shared-models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  deleteAccount$(accountId: Account['id']) {
    return this.#http.delete(`${this.#env.api.kit}/entity/${accountId}`);
  }
}
