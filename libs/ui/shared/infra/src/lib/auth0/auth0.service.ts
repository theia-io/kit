import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Auth0User } from '@kitouch/shared-models';
import { ENVIRONMENT } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  #environment = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  signIn() {
    window.location.href = `http://localhost:3000/api/auth/login`; // express-openid-connect handles this
  }

  handleSignInRedirect() {
    return this.#getUser$();
  }

  #getUser$() {
    const {
      api: { auth },
    } = this.#environment;
    return this.#http.get<Auth0User>(`${auth}/user`);
  }

  deleteAuth0User() {
    console.log('implement delete auth0 user');
  }
}
