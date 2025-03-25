import { Component, inject, OnInit } from '@angular/core';
import { Auth0Service } from '@kitouch/shared-infra';

@Component({
  standalone: true,
  selector: 'kit-page-redirect-auth0',
  templateUrl: './redirect-auth0.component.html',
  imports: [],
})
export class PageRedirectAuth0Component implements OnInit {
  #auth0Service = inject(Auth0Service);

  ngOnInit() {
    console.log('AUTH0 REDIRECT');
    this.#auth0Service.getProfile$().subscribe((v) => console.log(v));
  }
}
