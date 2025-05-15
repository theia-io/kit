import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  SharedNavBarStaticComponent,
  SharedStaticInfoComponent,
} from '@kitouch/containers';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { select, Store } from '@ngrx/store';

@Component({
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
      [userLoggedIn]="!!(currentProfile$ | async)"
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
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #router = inject(Router);
  #auth0Service = inject(Auth0Service);

  currentProfile$ = this.#store.pipe(select(selectCurrentProfile));

  constructor() {
    console.log('\n[KitStaticComponent] constructor:\n\n');
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
