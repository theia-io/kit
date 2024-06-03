import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tweet-button',
  standalone: true,
  imports: [CommonModule],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <button
      class="w-full py-2 px-4 rounded-full bg-neutral-400 hover:bg-neutral-600 text-white font-bold"
    >
      Tweet
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetButtonComponent {}
