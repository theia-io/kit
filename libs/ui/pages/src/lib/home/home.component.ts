import { AsyncPipe } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  FeatTweetActions,
  TweetApiActions,
  selectAllTweets,
} from '@kitouch/feat-tweet-data';
import {
  FeatTweetTweetingComponent,
  FeatTweetTweetyComponent,
} from '@kitouch/feat-tweet-ui';
import { FeatFollowSuggestionsComponent } from '@kitouch/follow-ui';
import { selectCurrentProfileFollowing } from '@kitouch/kit-data';
import { Tweety } from '@kitouch/shared-models';
import {
  AccountTileComponent,
  DividerComponent,
  UiCompCardComponent,
  UiCompGradientCardComponent,
  UiKitCompAnimatePingComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import {
  APP_PATH_DIALOG,
  OUTLET_DIALOG,
  TWEET_NEW_TWEET_TIMEOUT,
} from '@kitouch/ui-shared';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, map, merge, switchMap, tap, timer } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ButtonModule,
    //
    UiKitCompAnimatePingComponent,
    UiCompCardComponent,
    UiCompGradientCardComponent,
    AccountTileComponent,
    DividerComponent,
    FeatFollowSuggestionsComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    UiKitTweetButtonComponent,
  ],
})
export class PageHomeComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #router = inject(Router);
  #actions = inject(Actions);

  homeTweets$ = this.#store.pipe(
    select(selectAllTweets),
    tap(() => this.tweetsLoading.set(false))
  );
  followingProfiles = toSignal(
    this.#store.pipe(select(selectCurrentProfileFollowing))
  );

  tweetsLoading = signal(true);
  #reloadTweetsDisabled$$ = new BehaviorSubject<boolean>(false);
  reloadTweetsDisabled$ = merge(
    this.#reloadTweetsDisabled$$.asObservable(),
    this.#reloadTweetsDisabled$$.asObservable().pipe(
      switchMap(() => timer(2500)),
      map(() => false)
    )
  );
  newlyAddedTweets = signal<Set<Tweety['id']>>(new Set());

  ngOnInit(): void {
    this.#store.dispatch(TweetApiActions.getAll());

    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetSuccess),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(({ tweet }) => {
        this.newlyAddedTweets.update(
          (tweetsSet) => new Set([...tweetsSet.values(), tweet.id])
        );

        setTimeout(() => {
          this.newlyAddedTweets.update(
            (tweetsSet) =>
              new Set([...tweetsSet.values()].filter((id) => id !== tweet.id))
          );
        }, TWEET_NEW_TWEET_TIMEOUT * 2);
      });
  }

  reloadTweets() {
    this.tweetsLoading.set(true);
    this.#reloadTweetsDisabled$$.next(true);
    this.#store.dispatch(TweetApiActions.getAll());
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [OUTLET_DIALOG]: APP_PATH_DIALOG.Tweet } },
    ]);
  }
}
