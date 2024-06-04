import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TweetButtonComponent } from '@kitouch/ui/components';

@Component({
  standalone: true,
  imports: [CommonModule, TweetButtonComponent],
  selector: 'feat-tweeting',
  templateUrl: './tweeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatTweetTweetingComponent {}
