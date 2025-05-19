import { Component, inject } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { Auth0Service } from '@kitouch/shared-infra';
import { PagesFeatureFarewellBenefitsComponent } from './farewell-benefits.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  templateUrl: './farewell-page.component.html',
  imports: [SharedFeatureIntroComponent, PagesFeatureFarewellBenefitsComponent],
})
export class PagesFeatureFarewellComponent {
  #auth0Service = inject(Auth0Service);

  loggedIn = toSignal(this.#auth0Service.loggedIn$, { initialValue: false });

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
