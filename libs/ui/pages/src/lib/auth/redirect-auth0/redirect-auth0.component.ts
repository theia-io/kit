import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FeatAuth0Events } from '@kitouch/kit-data';
import { Auth0Service } from '@kitouch/shared-infra';
import { UiKitSpinnerComponent } from '@kitouch/ui-components';
import { Store } from '@ngrx/store';
import { delay, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-redirect-auth0',
  imports: [NgOptimizedImage, UiKitSpinnerComponent],
  templateUrl: './redirect-auth0.component.html',
})
export class PageRedirectAuth0Component implements OnInit {
  #router = inject(Router);
  #store = inject(Store);
  #auth0Service = inject(Auth0Service);

  constructor() {
    of(true)
      .pipe(delay(5000), takeUntilDestroyed())
      .subscribe(() => {
        this.#router.navigate(['/']);
      });
  }

  ngOnInit() {
    const separateWindowSignIn = this.#auth0Service.separateWindowSignIn();
    if (separateWindowSignIn) {
      this.#auth0Service.separateWindowSignInClearAndTrigger();
      window.close();
    } else {
      const postLoginUrl = this.#auth0Service.getPostRedirectUrl();
      this.#store.dispatch(FeatAuth0Events.handleRedirect({ postLoginUrl }));
    }
  }
}
