import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Auth0Service } from '@kitouch/shared-infra';
import { UiKitSpinnerComponent } from '@kitouch/ui-components';
import { delay, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-sign-in-resolve-semi-silent',
  imports: [NgOptimizedImage, UiKitSpinnerComponent],
  templateUrl: './sign-in-resolve-semi-silent.component.html',
})
export class PageSignInResolveSemiSilentComponent {
  #router = inject(Router);
  #auth0Service = inject(Auth0Service);

  constructor() {
    of(true)
      .pipe(delay(5000), takeUntilDestroyed())
      .subscribe(() => {
        this.#router.navigate(['/']);
      });

    this.#auth0Service.loggedIn$
      .pipe(takeUntilDestroyed())
      .subscribe((loggedIn) => {
        if (loggedIn) {
          this.#router.navigate(['/']);
        }
      });
  }
}
