import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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

  constructor() {
    console.log('\n[PageSignInResolveSemiSilentComponent] constructor:\n\n');
    of(true)
      .pipe(delay(5000), takeUntilDestroyed())
      .subscribe(() => {
        console.log('[PageSignInResolveSemiSilentComponent] CULPRIT REDIRECT');
        this.#router.navigate(['/']);
      });
  }
}
