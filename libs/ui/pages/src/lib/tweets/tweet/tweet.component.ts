import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kit-page-tweet',
  imports: [CommonModule],
  template: `individual-tweet`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTweetComponent {}
