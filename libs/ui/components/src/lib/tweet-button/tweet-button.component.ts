import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'ui-kit-tweet-button',
  standalone: true,
  imports: [NgClass, ButtonModule],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <p-button
      [severity]="severity()"
      [styleClass]="'w-full flex ' + styleClass() + ' ' + kClass()"
      [disabled]="disabled()"
      (onClick)="clickEvent.emit($event)"
      aria-label="tweet"
    >
      <span>{{ text() }}</span>
      @if(loader()) {
      <i class="pi pi-sync animate-spin" style="font-size: 1rem"></i>
      } @if(icon() && !loader()) {
      <i
        class="pi"
        [ngClass]="icon()"
        [class.animate-wiggle]="iconAnimate()"
        style="font-size: 1.5rem"
      ></i>
      }
    </p-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitTweetButtonComponent {
  text = input('Tweet');
  severity = input<Button['severity']>('primary');
  kClass = input<string>('');

  disabled = input(false);
  loader = input(false);
  icon = input('pi-send');
  iconAnimate = input(true);

  styleClass = computed(() =>
    !this.loader() && !this.icon() ? 'justify-center' : 'justify-between'
  );

  clickEvent = output<Event>();
}
