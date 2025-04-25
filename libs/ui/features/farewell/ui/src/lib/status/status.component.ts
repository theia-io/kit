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

  updateStatus = output<FarewellStatus>();

  farewellStatus = FarewellStatus;

  updateStatusHandler(status: Farewell['status']) {
    if (!this.canBeChanged()) {
      return;
    }
    this.updateStatus.emit(status);
  }
}
