import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { CardModule } from 'primeng/card';
import { PagesFeatureBenefitsComponent } from '../benefits/benefits.component';

@Component({
  standalone: true,
  selector: 'kit-page-feature-connected-page-benefits',
  templateUrl: './connected-benefits.component.html',
  imports: [
    RouterModule,
    NgOptimizedImage,
    //
    PagesFeatureBenefitsComponent,
    CardModule,
  ],
})
export class PagesFeatureConnectedBenefitsComponent {
  isAtFeaturePage = input(false);

  featuresConnectedUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;
}
