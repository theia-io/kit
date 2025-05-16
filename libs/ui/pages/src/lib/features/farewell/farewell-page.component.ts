import { Component, inject } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { Auth0Service } from '@kitouch/shared-infra';
import { PagesFeatureFarewellBenefitsComponent } from './farewell-benefits.component';

@Component({
  standalone: true,
  templateUrl: './farewell-page.component.html',
  imports: [SharedFeatureIntroComponent, PagesFeatureFarewellBenefitsComponent],
})
export class PagesFeatureFarewellComponent {
  #auth0Service = inject(Auth0Service);

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
