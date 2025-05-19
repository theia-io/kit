import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { Auth0Service } from '@kitouch/shared-infra';
import { PagesFeatureConnectedBenefitsComponent } from './connected-benefits.component';

@Component({
  standalone: true,
  templateUrl: './connected-page.component.html',
  imports: [
    SharedFeatureIntroComponent,
    PagesFeatureConnectedBenefitsComponent,
  ],
})
export class PagesFeatureConnectedComponent {
  #auth0Service = inject(Auth0Service);

  loggedIn = toSignal(this.#auth0Service.loggedIn$, { initialValue: false });

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
