import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-comp-card',
  template: `
    <article class="flex sm:p-2 md:p-4 rounded-[10px] transition hover:shadow-xl bg-white">
      <div *ngIf="verticalContent" class="rotate-180 p-2 [writing-mode:_vertical-lr]">
        <!-- <time
          datetime="2022-10-10"
          class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
        >
          <span>2022</span>
          <span class="w-px flex-1 bg-gray-900/10"></span>
          <span>Oct 10</span>
        </time> -->
      </div>

      <ng-content />
    </article>
  `,
  imports: [
    NgIf
  ],
})
export class UiCompCardComponent {
    @Input()
    verticalContent = '';
}
