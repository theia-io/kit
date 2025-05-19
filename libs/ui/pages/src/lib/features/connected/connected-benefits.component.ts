import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthorizedFeatureDirective } from '@kitouch/containers';
import { APP_PATH, APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
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
    AuthorizedFeatureDirective,
    UIKitSmallerHintTextUXDirective,
  ],
})
export class PagesFeatureConnectedBenefitsComponent {
  isAtFeaturePage = input(false);

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };
  feedUrl = `/${APP_PATH.Feed}`;

  featuresConnectedUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesConnected}`;
}
