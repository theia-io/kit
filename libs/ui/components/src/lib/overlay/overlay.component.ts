import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-page-overlay',
  template: `@if(show()) {
    <div class="absolute top-20 left-0 w-full h-full z-50">
      <div
        class="fixed top-0 left-0 w-full h-full opacity-95 bg-slate-800"
      ></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3">
        <p class="text-2xl italic font-semibold text-white">
          {{ text() }}
        </p>

        <div class="mt-12">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitPageOverlayComponent {
  show = input<boolean>(false);
  text = input<string>();
}
