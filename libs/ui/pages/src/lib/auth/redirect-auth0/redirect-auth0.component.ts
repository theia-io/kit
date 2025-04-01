import { Component, inject, OnInit } from '@angular/core';
import { FeatAuth0Events } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'kit-page-redirect-auth0',
  templateUrl: './redirect-auth0.component.html',
})
export class PageRedirectAuth0Component implements OnInit {
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  ngOnInit() {
    const separateWindowSignIn = this.#auth0Service.separateWindowSignIn();
    console.log('separateWindowSignIn', separateWindowSignIn);
    if (separateWindowSignIn) {
      this.#auth0Service.separateWindowSignInClear();
    } else {
      this.#store.dispatch(FeatAuth0Events.handleRedirect());
    }
  }
}
