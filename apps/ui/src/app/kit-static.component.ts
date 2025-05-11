import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import {
  SharedNavBarStaticComponent,
  SharedStaticInfoComponent,
} from '@kitouch/containers';
import { FeatAuth0Events, selectCurrentProfile } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { select, Store } from '@ngrx/store';
import { delay, of, switchMap, take } from 'rxjs';

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
      [userLoggedIn]="!!(currentProfile$ | async)"
      (getStarted)="handleGetStarted()"
    />
    <div class="flex-grow flex flex-col">
      <router-outlet></router-outlet>
    </div>
    <div class="bg-secondary">
      <shared-static-info
        [slim]="true"
        class="container flex items-center justify-end gap-4 mx-auto bg-secondary"
      />
    </div>
  `,
})
export class KitStaticComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #router = inject(Router);
  #auth0Service = inject(Auth0Service);

  currentProfile$ = this.#store.pipe(select(selectCurrentProfile));

  constructor() {
    console.log('\n[KitStaticComponent] constructor:\n\n');
    // inject(Auth0Service).signIn();
    // this.#store.dispatch(FeatAuth0Events.silentSignIn());
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const currentUrl = this.#router.url;
    console.log('\n[KitStaticComponent] ngOnInit:', currentUrl);
    if (currentUrl.includes('/s/')) {
      of(true)
        .pipe(
          delay(2000),
          switchMap(() => this.#auth0Service.loggedIn$),
          take(1),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe((loggedIn) => {
          console.log('\n[KitStaticComponent] ngOnInit 1:', currentUrl);
          if (!loggedIn) {
            this.#store.dispatch(FeatAuth0Events.tryAuth());
          }
        });
    }
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
