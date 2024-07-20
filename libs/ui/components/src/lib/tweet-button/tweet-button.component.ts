import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ui-kit-tweet-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <p-button
      [disabled]="disabled()"
      (onClick)="onClickEvent.emit($event)"
      aria-label="tweet"
    >
      @if(loader()) { }
      <span class="px-3">{{ text() }}</span>
      <i class="pi pi-send animate-wiggle" style="font-size: 1.5rem"></i>
    </p-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetButtonComponent {
  text = input('Tweet');
  disabled = input(false);
  loader = input(false);

  onClickEvent = output<Event>();
}
