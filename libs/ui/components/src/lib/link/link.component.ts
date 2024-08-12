import { Directive, HostBinding } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[uiKitLinkUX]',
})
export class UIKitLinkUXDirective {
  @HostBinding('class')
  className =
    'rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700';
}
