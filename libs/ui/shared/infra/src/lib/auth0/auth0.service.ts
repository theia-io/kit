import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  // angular
  #environment = inject(ENVIRONMENT);
  #router = inject(Router);
  #http = inject(HttpClient);

  signIn() {
    window.location.href = `http://localhost:3000/api/auth/login?returnTo=http://localhost:4200/s/redirect-auth0`; // express-openid-connect handles this
    // return this.#http
    //   .get('/api/auth/login')
  }

  getProfile$() {
    return this.#http.get('/api/auth/profile');
  }
}
