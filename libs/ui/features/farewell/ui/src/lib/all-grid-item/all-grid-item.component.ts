import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { KudoBoard } from '@kitouch/shared-models';
import { UiCompGradientCardComponent } from '@kitouch/ui-components';
import { FeatKudoBoardViewComponent } from '@kitouch/ui-kudoboard';

@Component({
  standalone: true,
  selector: 'feat-farewell-all-grid-item',
  templateUrl: './all-grid-item.component.html',
  imports: [
    RouterModule,
    //
    UiCompGradientCardComponent,
    FeatKudoBoardViewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellAllGridItemComponent {
  kudoboard = input.required<KudoBoard>();
  smaller = input<boolean>(false);

  readonly kudoBoardAllUrl = `/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
  readonly kudoBoardPartialUrl = `/s/${APP_PATH_ALLOW_ANONYMOUS.KudoBoard}`;
}
