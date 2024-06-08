import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Tweety } from '@kitouch/shared/models';
import { AccountTileComponent } from '@kitouch/ui/components';
import { FeatTweetActionsComponent } from '../actions/actions.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    //
    FeatTweetActionsComponent,
    AccountTileComponent,
  ],
})
export class FeatTweetTweetyComponent {
  @Input({ required: true })
  tweet!: Tweety;

  domSanitizer = inject(DomSanitizer);

  replyHandler() {
    console.info('Implement replyHandler');
  }

  repostHandler() {
    console.info('Implement repostHandler');
  }

  likeHandler() {
    console.info('Implement likeHandler');
  }

  shareHandler() {
    console.info('Implement shareHandler');
  }

  bookmarkHandler() {
    console.info('Implement bookmarkHandler');
  }
}
