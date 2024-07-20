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
      styleClass="w-full flex justify-between"
      [disabled]="disabled()"
      (onClick)="onClickEvent.emit($event)"
      aria-label="tweet"
    >
      <span>{{ text() }}</span>
      @if(loader()) {
      <i class="pi pi-sync animate-spin" style="font-size: 1rem"></i>
      } @else {
      <i class="pi pi-send" [class.animate-wiggle]="animate()" style="font-size: 1.5rem"></i>
      }
    </p-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetButtonComponent {
  text = input('Tweet');
  disabled = input(false);
  loader = input(false);
  animate = input(true);

  onClickEvent = output<Event>();
}
