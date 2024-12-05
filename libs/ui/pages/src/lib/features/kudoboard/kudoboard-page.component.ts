import { Component } from '@angular/core';
import { SharedFeatureIntroComponent } from '@kitouch/containers';
import { PagesFeatureKudoBoardBenefitsComponent } from './benefits.component';

@Component({
  standalone: true,
  templateUrl: './kudoboard-page.component.html',
  imports: [
    SharedFeatureIntroComponent,
    PagesFeatureKudoBoardBenefitsComponent,
  ],
})
export class PagesFeatureKudoBoardComponent {}
