import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SharedNavBarStaticComponent,
  SharedStaticInfoComponent,
} from '@kitouch/containers';
import { selectCurrentProfile } from '@kitouch/kit-data';
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
    <shared-navbar-static [userLoggedIn]="!!(currentProfile$ | async)" />
    <div class="flex-grow flex flex-col">
      <router-outlet></router-outlet>
    </div>
    <div class="w-full bg-secondary">
      <shared-static-info
        [slim]="true"
        class="container flex items-center justify-end gap-4 mx-auto"
      />
    </div>
  `,
})
export class KitStaticComponent {
  currentProfile$ = inject(Store).pipe(select(selectCurrentProfile));

  constructor() {
    // inject(Auth0Service).signIn();
  }
}
