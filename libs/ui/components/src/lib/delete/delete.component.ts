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
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      delete.emit($event)
    "
    role="button"
    class="pi pi-times-circle absolute z-10 hover:animate-pulse"
    [ngClass]="[
      xOffset() ?? 'right-2',
      yOffset() ?? 'top-2',
      background() ? 'bg-white p-[2px] rounded-full' : ''
    ]"
    style="font-size: 1.5rem"
  ></i>`,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitDeleteComponent {
  xOffset = input<string>();
  yOffset = input<string>();

  background = input(false);

  delete = output<Event>();
}
