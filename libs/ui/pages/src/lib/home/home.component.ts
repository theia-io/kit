import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  FeatTweetActions,
  TweetApiActions,
  selectAllTweets,
} from '@kitouch/feat-tweet-data';
import { Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  NewUIItemComponent,
  TweetButtonComponent,
  UiCompCardComponent,
  UiCompGradientCardComponent,
} from '@kitouch/ui/components';
import {
  FeatTweetTweetingComponent,
  FeatTweetTweetyComponent,
} from '@kitouch/ui/features/tweet';
import { APP_PATH, TWEET_NEW_TWEET_TIMEOUT } from '@kitouch/ui/shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    //
    NewUIItemComponent,
    UiCompGradientCardComponent,
    UiCompCardComponent,
    AccountTileComponent,
    DividerComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    TweetButtonComponent,
  ],
})
export class PageHomeComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);
  #actions = inject(Actions);

  homeTweets$ = this.#store.pipe(select(selectAllTweets));

  newlyAddedTweets = signal<Set<Tweety['id']>>(new Set());

  ngOnInit(): void {
    this.#store.dispatch(TweetApiActions.getAll());

    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetSuccess),
        take(1),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ tweet }) => {
        this.newlyAddedTweets.update(
          (tweetsSet) => new Set([...tweetsSet.values(), tweet.id])
        );

        setTimeout(() => {
          this.newlyAddedTweets.update(
            (tweetsSet) =>
              new Set([...tweetsSet].filter((id) => id !== tweet.id))
          );
        }, TWEET_NEW_TWEET_TIMEOUT * 2);
      });
  }

  tweetHandler(id: string) {
    this.#router.navigate(['/', APP_PATH.Tweets, id]);
  }
}