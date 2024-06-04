import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AccountTileComponent,
  TweetButtonComponent,
} from '@kitouch/ui/components';
import {
  FeatTweetTweetingComponent,
  FeatTweetTweetyComponent,
} from 'libs/ui/features/tweet/ui/src';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    //
    AccountTileComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    TweetButtonComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
