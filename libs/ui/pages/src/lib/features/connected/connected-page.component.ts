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

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
