import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Tweety } from '@kitouch/shared/models';
import { MyAccountTileComponent } from '@kitouch/ui/features/account';

@Component({
  standalone: true,
  imports: [CommonModule, MyAccountTileComponent],
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatTweetTweetyComponent {
  @Input({ required: true })
  tweet: Tweety | null = null;
}
