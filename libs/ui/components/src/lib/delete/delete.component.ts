import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-delete',
  template: `<i
    (click)="
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      onDelete.emit($event)
    "
    role="button"
    class="pi pi-times-circle absolute z-10 hover:animate-pulse"
    [ngClass]="[xOffset() ?? 'right-2', yOffset() ?? 'top-2']"
    style="font-size: 1.5rem"
  ></i> `,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitDeleteComponent {
  xOffset = input<string>();
  yOffset = input<string>();
  onDelete = output<Event>();
}
