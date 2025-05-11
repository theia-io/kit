import { Directive, effect, HostBinding, input } from '@angular/core';

export type KlassOverwrite = {
  text?: {
    size?: string;
    color?: string;
    hoverColor?: string;
  };
  background?: {
    hoverColor?: string;
  };
};

const LINK_TAILWIND_CLASSES =
  'duration-100 rounded-lg font-medium [text-align:_inherit]';

@Directive({
  standalone: true,
  selector: '[uiKitSmallTextTailwindClasses]',
})
export class UIKitSmallerHintTextUXDirective {
  klasses = input<KlassOverwrite>();

  @HostBinding('class')
  className = LINK_TAILWIND_CLASSES;

  constructor() {
    effect(() => {
      // those classes have to be used somewhere so they are not removed from bundle by tailwind postcss bundler
      const { text, background } = this.klasses() ?? {};
      const {
        size: textSize,
        color: textCover,
        hoverColor: textHoverColor,
      } = text ?? {};
      const { hoverColor: backgroundHoverColor } = background ?? {};

      this.className = `
          ${LINK_TAILWIND_CLASSES} 
          ${textSize ?? 'text-sm'}
          ${textCover ?? 'text-gray-500'} hover:${
            textHoverColor ?? 'text-gray-700'
          }
          hover:${backgroundHoverColor ?? 'bg-gray-100'}
        `;
    });
  }
}
