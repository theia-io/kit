import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthorizedFeatureDirective } from '@kitouch/containers';
import { APP_PATH, APP_PATH_STATIC_PAGES } from '@kitouch/shared-constants';
import { DeviceService } from '@kitouch/shared-services';
import {
  KlassOverwrite,
  UIKitSmallerHintTextUXDirective,
} from '@kitouch/ui-components';
import { CardModule } from 'primeng/card';
import { startWith } from 'rxjs';
import { PagesFeatureBenefitsComponent } from '../benefits/benefits.component';

@Component({
  standalone: true,
  selector: 'kit-page-feature-farewell-page-benefits',
  templateUrl: `./farewell-benefits.component.html`,
  imports: [
    RouterModule,
    //
    CardModule,
    //
    UIKitSmallerHintTextUXDirective,
    PagesFeatureBenefitsComponent,
    AuthorizedFeatureDirective,
  ],
})
export class PagesFeatureFarewellBenefitsComponent {
  isAtFeaturePage = input(false);

  $hintHidden = inject(DeviceService).isMobile$.pipe(startWith(true));

  getStartedKlassOverwrite: KlassOverwrite = {
    text: {
      size: 'text-lg',
      color: 'text-white',
      hoverColor: 'text-slate-700',
    },
  };

  featuresFarewellUrl = `/${APP_PATH_STATIC_PAGES.Features}/${APP_PATH_STATIC_PAGES.FeaturesFarewell}`;
  farewellGenerateUrl = `/${APP_PATH.Farewell}/generate`;
}
