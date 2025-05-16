import { Component, inject } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { PagesFeatureKudoBoardBenefitsComponent } from './kudoboard-benefits.component';
import { Auth0Service } from '@kitouch/shared-infra';

@Component({
  standalone: true,
  templateUrl: './kudoboard-page.component.html',
  imports: [
    SharedFeatureIntroComponent,
    PagesFeatureKudoBoardBenefitsComponent,
  ],
})
export class PagesFeatureKudoBoardComponent {
  #auth0Service = inject(Auth0Service);

  handleGetStarted() {
    this.#auth0Service.signIn();
  }
}
