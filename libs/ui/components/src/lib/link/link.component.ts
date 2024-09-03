import { Directive, effect, HostBinding, input } from '@angular/core';

const LINK_TAILWIND_CLASSES =
  'rounded-lg text-sm font-medium text-gray-500 [text-align:_inherit]';

@Directive({
  standalone: true,
  selector: '[uiKitSmallTextTailwindClasses]',
})
export class UIKitSmallerHintTextUXDirective {
  isLink = input(false);

  @HostBinding('class')
  className = LINK_TAILWIND_CLASSES;

  constructor() {
    effect(() => {
      const isLink = this.isLink();
      if (isLink) {
        // those classes have to be used somewhere so they are not removed from bundle by tailwind postcss bundler
        this.className = `${LINK_TAILWIND_CLASSES} hover:bg-gray-100 hover:text-gray-700`;
      }
    });
  }
}
