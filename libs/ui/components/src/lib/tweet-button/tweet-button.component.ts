import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
      [styleClass]="'w-full flex ' + styleClass()"
      [disabled]="disabled()"
      (onClick)="onClickEvent.emit($event)"
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

  disabled = input(false);
  loader = input(false);
  icon = input('pi-send');
  iconAnimate = input(true);

  styleClass = computed(() =>
    !this.loader() && !this.icon() ? 'justify-center' : 'justify-between'
  );

  onClickEvent = output<Event>();
}
