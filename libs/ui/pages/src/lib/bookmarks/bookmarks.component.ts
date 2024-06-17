import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatTweetTweetyComponent } from '@kitouch/features/tweet/ui';
import { UiCompCardComponent, AccountTileComponent, DividerComponent, TweetButtonComponent } from '@kitouch/ui/components';

@Component({
  standalone: true,
  selector: 'kit-page-bookmarks',
  templateUrl: './bookmarks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    //
    UiCompCardComponent,
    FeatTweetTweetyComponent,
    AccountTileComponent,
    DividerComponent,
    TweetButtonComponent,
  ],
})
export class PageBookmarksComponent {}
