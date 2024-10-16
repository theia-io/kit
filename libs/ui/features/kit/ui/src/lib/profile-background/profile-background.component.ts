import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'feat-kit-profile-background',
  templateUrl: './profile-background.component.html',
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatKitProfileBackgroundComponent {
  background = input<string>();
}
