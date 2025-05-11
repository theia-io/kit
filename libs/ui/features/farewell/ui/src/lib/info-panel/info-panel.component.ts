import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Farewell, KudoBoard } from '@kitouch/shared-models';
import { TooltipModule } from 'primeng/tooltip';
import { FeatFarewellAnalyticsComponent } from '../analytics/analytics.component';
import { FeatFarewellStatusComponent } from '../status/status.component';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';

@Component({
  selector: 'feat-farewell-info-panel',
  templateUrl: './info-panel.component.html',
  imports: [
    FeatFarewellStatusComponent,
    FeatFarewellAnalyticsComponent,
    TooltipModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellInfoPanelComponent {
  farewell = input.required<Farewell>();
  linkedKudoboard = input<KudoBoard | null | undefined>(null);
  preview = input<boolean>(true);

  showUpdatedDate = input<boolean>(false);

  readonly kudoBoardPartialUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
}
