import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-kit-color-displayer',
  templateUrl: './color-displayer.component.html',
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiKitColorDisplayerComponent {
  color = input<string>();
}
