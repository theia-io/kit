import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-placeholder',
  template: '<div class="h-full w-full placeholder"></div>',
  imports: [NgClass],
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .placeholder {
        background: #eee;
        border-radius: 1rem;
        position: relative;
        overflow: hidden;
      }

      .placeholder:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100px;
        background: linear-gradient(90deg, #eee, #f4f4f4, #eee);
        animation: gradient 1s infinite ease-in-out;
      }

      @keyframes gradient {
        from {
          left: 0%;
        }

        to {
          left: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitPlaceholderComponent {}
