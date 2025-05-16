import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  APP_PATH_ALLOW_ANONYMOUS,
  APP_PATH_STATIC_PAGES,
} from '@kitouch/shared-constants';
import { DeviceService } from '@kitouch/shared-infra';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { CardModule } from 'primeng/card';
import { startWith } from 'rxjs';
import { PagesFeatureBenefitsComponent } from '../benefits/benefits.component';

@Component({
  standalone: true,
  selector: 'kit-page-feature-kudoboard-page-benefits',
  templateUrl: './kudoboard-benefits.component.html',
  imports: [
    RouterModule,
    NgOptimizedImage,
    //
    CardModule,
    //
    PagesFeatureBenefitsComponent,
    UIKitSmallerHintTextUXDirective,
  ],
})
export class PagesFeatureKudoBoardBenefitsComponent {
  isAtFeaturePage = input(false);
  $hintHidden = inject(DeviceService).isMobile$.pipe(startWith(true));

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  featuresKudoBoardUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesKudoboard}`;
  kudoBoardGenerateUrl = `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}/generate`;
}
