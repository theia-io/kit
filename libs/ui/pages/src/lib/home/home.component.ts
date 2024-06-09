import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FeatTweetActions,
  selectAllTweets
} from '@kitouch/feat-tweet-data';
import {
  AccountTileComponent,
  DividerComponent,
  TweetButtonComponent,
} from '@kitouch/ui/components';
import {
  FeatTweetTweetingComponent,
  FeatTweetTweetyComponent,
} from '@kitouch/ui/features/tweet';
import { Store, select } from '@ngrx/store';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //
    AccountTileComponent,
    DividerComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    TweetButtonComponent,
  ],
})
export class PageHomeComponent implements OnInit {
  #store = inject(Store);

  homeTweets$ = this.#store.pipe(select(selectAllTweets));

  ngOnInit(): void {
    this.#store.dispatch(FeatTweetActions.getAll());
  }
}
