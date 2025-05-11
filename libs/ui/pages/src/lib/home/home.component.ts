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
import {
  selectCurrentProfile,
  selectCurrentProfileFollowing,
} from '@kitouch/kit-data';
import { APP_PATH_DIALOG, OUTLET_DIALOG } from '@kitouch/shared-constants';
import { Tweety } from '@kitouch/shared-models';
import {
  DEFAULT_ANIMATE_TIMEOUT,
  DividerComponent,
  UiCompCardComponent,
  UiCompGradientCardComponent,
  UiKitCompAnimatePingComponent,
  UiKitTweetButtonComponent,
} from '@kitouch/ui-components';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import {
  BehaviorSubject,
  distinctUntilKeyChanged,
  filter,
  map,
  merge,
  switchMap,
  tap,
  timer,
} from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ButtonModule,
    //
    UiKitCompAnimatePingComponent,
    UiCompCardComponent,
    UiCompGradientCardComponent,
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
    tap(() => this.tweetsLoading.set(false)),
  );
  followingProfiles = toSignal(
    this.#store.pipe(select(selectCurrentProfileFollowing)),
  );

  constructor() {
    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter(Boolean),
        distinctUntilKeyChanged('id'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.#store.dispatch(TweetApiActions.getAll()));
  }

  tweetsLoading = signal(true);
  #reloadTweetsDisabled$$ = new BehaviorSubject<boolean>(false);
  reloadTweetsDisabled$ = merge(
    this.#reloadTweetsDisabled$$.asObservable(),
    this.#reloadTweetsDisabled$$.asObservable().pipe(
      switchMap(() => timer(2500)),
      map(() => false),
    ),
  );
  newlyAddedTweets = signal<Set<Tweety['id']>>(new Set());

  ngOnInit(): void {
    this.#actions
      .pipe(
        ofType(FeatTweetActions.tweetSuccess),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(({ tweet }) => {
        this.newlyAddedTweets.update(
          (tweetsSet) => new Set([...tweetsSet.values(), tweet.id]),
        );

        setTimeout(() => {
          this.newlyAddedTweets.update(
            (tweetsSet) =>
              new Set([...tweetsSet.values()].filter((id) => id !== tweet.id)),
          );
        }, DEFAULT_ANIMATE_TIMEOUT * 2);
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
