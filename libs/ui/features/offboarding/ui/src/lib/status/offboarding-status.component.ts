import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ExpOffboardingStatus } from '@kitouch/shared-models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'feat-offboarding-status',
  templateUrl: './offboarding-status.component.html',
  imports: [ButtonModule, TagModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatOffboardingStatusComponent {
  status = input.required<ExpOffboardingStatus>();
  canBeChanged = input<boolean>(false);
  showTooltip = input<boolean>(false);

  updatedStatus = output<ExpOffboardingStatus>();

  offboardingStatus = ExpOffboardingStatus;

  updateStatus(status: ExpOffboardingStatus) {
    if (!this.canBeChanged()) {
      return;
    }
    this.updatedStatus.emit(status);
  }
}
