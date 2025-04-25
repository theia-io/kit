import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { KudoBoardStatus } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'feat-kudoboard-status',
  templateUrl: './status.component.html',
  imports: [ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKudoBoardStatusComponent {
  status = input.required<KudoBoardStatus>();
  canBeChanged = input<boolean>(false);

  updatedStatus = output<KudoBoardStatus>();

  kudoBoardStatus = KudoBoardStatus;

  updateStatus(status: KudoBoardStatus) {
    if (!this.canBeChanged()) {
      return;
    }
    this.updatedStatus.emit(status);
  }
}
