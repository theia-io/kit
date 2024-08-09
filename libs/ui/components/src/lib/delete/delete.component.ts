import { Component, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-delete',
  template: `<i
    (click)="$event.stopImmediatePropagation(); onDelete.emit()"
    role="button"
    class="pi pi-times-circle absolute top-2 right-2 hover:animate-pulse"
    style="font-size: 1.5rem"
  ></i> `,
})
export class UiKitDeleteComponent {
  onDelete = output<void>();
}
