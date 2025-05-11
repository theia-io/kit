import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum ButtonComponentType {
  Hover = 'Hover',
  Base = 'Base',
}

@Component({
  selector: 'ui-kit-button',
  template: ` <!-- Base -->
    <button
      *ngIf="type === buttonType.Base"
      class="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
    >
      <span
        class="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-indigo-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
      ></span>

      <span class="relative block border border-current bg-white px-8 py-3">
        {{ label }}
      </span>
    </button>

    <!-- Hover -->
    <button
      *ngIf="type === buttonType.Hover"
      class="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
    >
      <span
        class="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
      ></span>

      <span class="relative block border border-current bg-white px-8 py-3">
        {{ label }}
      </span>
    </button>`,
  imports: [CommonModule],
})
export class ButtonComponent {
  @Input()
  type = ButtonComponentType.Base;

  @Input({ required: true })
  label = '';

  buttonType = ButtonComponentType;
}
