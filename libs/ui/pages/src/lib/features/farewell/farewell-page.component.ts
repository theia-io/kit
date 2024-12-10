import { Component } from '@angular/core';
import { PagesFeatureFarewellBenefitsComponent } from './benefits.component';
import { SharedFeatureIntroComponent } from '@kitouch/containers';

@Component({
  standalone: true,
  templateUrl: './farewell-page.component.html',
  imports: [SharedFeatureIntroComponent, PagesFeatureFarewellBenefitsComponent],
})
export class PagesFeatureFarewellComponent {}
