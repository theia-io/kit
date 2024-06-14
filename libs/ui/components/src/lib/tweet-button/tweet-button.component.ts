import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
      [disabled]="disabled"
      class="w-full py-2 px-4 rounded-full bg-neutral-400 disabled:bg-neutral-300 hover:bg-neutral-600 text-white font-bold"
    >
      Tweet

      <svg *ngIf="loader" class="inline h-5 w-5 ml-2 animate-spin" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetButtonComponent {
  @Input()
  disabled = false;

  @Input()
  loader = false;
}
