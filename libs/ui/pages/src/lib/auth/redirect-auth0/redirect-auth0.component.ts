import { Component, inject, OnInit } from '@angular/core';
import { FeatAuth0Events } from '@kitouch/kit-data';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'kit-page-redirect-auth0',
  templateUrl: './redirect-auth0.component.html',
})
export class PageRedirectAuth0Component implements OnInit {
  #store = inject(Store);

  ngOnInit() {
    this.#store.dispatch(FeatAuth0Events.handleRedirect());
  }
}
