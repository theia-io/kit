import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth0User } from '@kitouch/shared-models';
import { BehaviorSubject } from 'rxjs';
import { ENVIRONMENT } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  #router = inject(Router);
  #environment = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  auth0User$$ = new BehaviorSubject<Auth0User | undefined>(undefined);

  signIn() {
    window.location.href = `http://localhost:3000/api/auth/login`; // express-openid-connect handles this
  }

  handleSignInRedirect() {
    this.#getUser$().subscribe((user) => {
      this.#router.navigateByUrl('/');
      this.auth0User$$.next(user);
    });
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
