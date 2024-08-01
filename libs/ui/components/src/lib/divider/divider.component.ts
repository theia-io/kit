import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum DividerType {
  TextInCenter = 'TextInCenter',
  TextCenterBlurry = 'TextCenterBlurry',
  TextOnLeft = 'TextOnLeft',
  TextOnRight = 'TextOnRight',
}

@Component({
  standalone: true,
  selector: 'ui-kit-divider',
  template: `
    @if (type === dividerTypes.TextInCenter) {
    <span class="flex items-center">
      <span class="h-px flex-1 bg-black"></span>
      <span class="shrink-0 px-6">{{ text }}</span>
      <span class="h-px flex-1 bg-black"></span>
    </span>
    } @else if (type === dividerTypes.TextCenterBlurry) {
    <span class="relative flex justify-center">
      <div
        class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
      ></div>

      <span class="relative z-10 bg-white px-6">{{ text }}</span>
    </span>
    } @else if (type === dividerTypes.TextOnLeft) {
    <span class="flex items-center">
      <span class="pr-6">{{ text }}</span>
      <span class="h-px flex-1 bg-black"></span>
    </span>
    } @else if (type === dividerTypes.TextOnRight) {
    <span class="flex items-center">
      <span class="h-px flex-1 bg-black"></span>
      <span class="pl-6">{{ text }}</span>
    </span>
    }
  `,
  imports: [CommonModule],
})
export class DividerComponent {
  @Input()
  type: DividerType = DividerType.TextCenterBlurry;

  @Input()
  text = '';

  dividerTypes = DividerType;
}
