import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-comp-new-ui-item',
  template: `
    <div class="relative">
      <ng-content />
      @if(newlyAddedItem()) {
      <span class="absolute top-1 right-1 flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"
        ></span>
      </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUIItemComponent {
  newlyAddedItem = input.required<boolean>();
}
