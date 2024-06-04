import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Tweety } from '@kitouch/shared/models';
import { AccountTileComponent } from '@kitouch/ui/components';

@Component({
  standalone: true,
  imports: [CommonModule, AccountTileComponent],
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatTweetTweetyComponent {
  @Input({ required: true })
  tweet: Tweety | null = null;
}
