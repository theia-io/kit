import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Farewell, FarewellStatus } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'feat-farewell-status',
  templateUrl: './status.component.html',
  imports: [ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatFarewellStatusComponent {
  status = input.required<Farewell['status']>();
  canBeChanged = input<boolean>(false);

  onUpdatedStatus = output<FarewellStatus>();

  farewellStatus = FarewellStatus;

  updateStatus(status: Farewell['status']) {
    if (!this.canBeChanged()) {
      return;
    }
    this.onUpdatedStatus.emit(status);
  }
}
