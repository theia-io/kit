import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-comp-card',
  template: `
    <article
      class="p-1 sm:p-2 md:p-4 rounded-[10px] transition hover:shadow-xl"
    >
      <ng-content />
    </article>
  `,
})
export class UiCompCardComponent {}
