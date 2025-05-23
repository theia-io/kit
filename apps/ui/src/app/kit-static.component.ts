import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SharedNavBarStaticComponent,
  SharedStaticInfoComponent,
} from '@kitouch/containers';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { select, Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    RouterModule,
    //
    SharedNavBarStaticComponent,
    SharedStaticInfoComponent,
  ],
  selector: 'app-kitouch-static',
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
  }
  `,
  template: `
    <shared-navbar-static
      [userLoggedIn]="!!(loggedIn$ | async)"
      (getStarted)="handleGetStarted()"
    />
    <div class="flex-grow flex flex-col">
      <router-outlet></router-outlet>
    </div>
    <div class="bg-secondary">
      <shared-static-info
        [slim]="true"
        class="container flex items-center justify-end gap-4 mx-2 md:mx-auto bg-secondary my-4 md:my-2"
      />
    </div>
  `,
})
export class KitStaticComponent {
  #auth0Service = inject(Auth0Service);

  loggedIn$ = this.#auth0Service.loggedIn$;

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
