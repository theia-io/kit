import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'ui-kit-spinner',
  template: `<p-progressSpinner [styleClass]="size()" ariaLabel="loading" />`,
  imports: [ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitSpinnerComponent {
  size = input('h-16 w-16');
}
