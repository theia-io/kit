import { Component } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { PagesFeatureConnectedBenefitsComponent } from './benefits.component';

@Component({
  standalone: true,
  templateUrl: './connected-page.component.html',
  imports: [
    SharedFeatureIntroComponent,
    PagesFeatureConnectedBenefitsComponent,
  ],
})
export class PagesFeatureConnectedComponent {}
