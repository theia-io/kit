import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-comp-gradient-card',
  template: ` <!--
  Heads up! 👋

  Custom CSS:
    - animate-background https://github.com/markmead/hyperui/blob/main/tailwind.preset.js
-->
    <article
      class="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
    >
      <div #ngContentRef class="rounded-[10px] bg-white p-2 sm:p-6">
        <ng-content></ng-content>
      </div>
    </article>`,
  imports: [CommonModule],
})
export class UiCompGradientCardComponent {}
