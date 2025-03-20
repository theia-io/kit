import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Farewell, KudoBoard } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { FeatKudoBoardAnalyticsComponent } from '../analytics/analytics.component';
import { FeatKudoBoardStatusComponent } from '../status/status.component';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-info-panel',
  templateUrl: './info-panel.component.html',
  imports: [
    FeatKudoBoardStatusComponent,
    FeatKudoBoardAnalyticsComponent,
    //
    TooltipModule,
    ButtonModule,
    OverlayPanelModule,
    //
    DatePipe,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoboardInfoPanelComponent {
  kudoboard = input.required<KudoBoard>();
  myLinkedFarewells = input<Array<Farewell> | null | undefined>(null);
  preview = input<boolean>(true);

  showUpdatedDate = input<boolean>(false);

  readonly farewellViewUrlPath = `/s/${APP_PATH_ALLOW_ANONYMOUS.Farewell}/`;
}
