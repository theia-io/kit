import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tweets-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tweets-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TweetsPageComponent {}
