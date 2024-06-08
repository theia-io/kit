import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { HomeTweetActions, selectHomeTweets } from '@kitouch/feat-tweet-data';
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
  imports: [
    CommonModule,
    //
    AccountTileComponent,
    DividerComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    TweetButtonComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  #store = inject(Store);

  homeTweets$ = this.#store.pipe(select(selectHomeTweets));

  ngOnInit(): void {
    this.#store.dispatch(HomeTweetActions.getAll());
  }
}
