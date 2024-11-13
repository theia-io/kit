import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-action-bar',
  templateUrl: './kit-action-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitActionBarComponent {}
