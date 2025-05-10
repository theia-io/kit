import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
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
    <div class="relative">
      <div class="bg-secondary fixed h-[200px] w-full"></div>
      <shared-static-info
        [slim]="true"
        class="relative z-10 container flex items-center justify-end gap-4 mx-auto"
      />
    </div>
  `,
})
export class KitStaticComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  currentProfile$ = this.#store.pipe(select(selectCurrentProfile));

  constructor() {
    // inject(Auth0Service).signIn();
    // this.#store.dispatch(FeatAuth0Events.silentSignIn());
  }

  ngOnInit(): void {
    of(null)
      .pipe(
        delay(1500),
        takeUntilDestroyed(this.#destroyRef),
        switchMap(() => this.#auth0Service.loggedIn$),
        take(1)
        // switchMap((loggedIn) =>
        //   loggedIn
        //     ? EMPTY
        //     : this.#auth0Service.getCurrentSessionAccountUserProfiles()
        // )
      )
      .subscribe(
        (loggedIn) => {
          if (!loggedIn) {
            this.#store.dispatch(FeatAuth0Events.tryAuth());
          }
        }
        // this.#store.dispatch(
        //   FeatAuth0Events.setAuthState(currentSessionAccountUserProfiles)
        // )
      );
  }

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
