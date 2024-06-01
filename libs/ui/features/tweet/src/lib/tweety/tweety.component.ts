import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {Tweety} from '@kitouch/shared/models';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatTweetTweetyComponent {
  @Input({required: true})
  tweet: Tweety | null = null;
}
