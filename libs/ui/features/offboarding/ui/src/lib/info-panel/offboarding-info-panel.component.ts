import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { ExpOffboarding } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { FeatOffBoardingAnalyticsComponent } from '../analytics/offboarding-analytics.component';
import { FeatOffboardingStatusComponent } from '../status/offboarding-status.component';

@Component({
  standalone: true,
  selector: 'feat-offboarding-info-panel',
  templateUrl: './offboarding-info-panel.component.html',
  imports: [
    FeatOffboardingStatusComponent,
    FeatOffBoardingAnalyticsComponent,
    //
    TooltipModule,
    ButtonModule,
    OverlayPanelModule,
    //
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatOffboardingInfoPanelComponent {
  offboarding = input.required<ExpOffboarding>();
  preview = input<boolean>(true);

  showUpdatedDate = input<boolean>(false);

  readonly offboardingUrl = `/${APP_PATH_ALLOW_ANONYMOUS.Offboarding}/`;
}
