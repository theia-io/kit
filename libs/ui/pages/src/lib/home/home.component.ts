import { AsyncPipe } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  FeatTweetActions,
  TweetApiActions,
  selectAllTweets,
  selectTweetsLazyState,
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
import { sortByCreatedTimeDesc } from '@kitouch/shared-services';
import {
  DEFAULT_ANIMATE_TIMEOUT,
  DividerComponent,
  UiCompCardComponent,
  UiCompGradientCardComponent,
  UiKitCompAnimatePingComponent,
  UiKitSpinnerComponent,
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
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';

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
    DividerComponent,
    FeatFollowSuggestionsComponent,
    FeatTweetTweetingComponent,
    FeatTweetTweetyComponent,
    UiKitTweetButtonComponent,
    UiKitSpinnerComponent,
  ],
})
export class PageHomeComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #store = inject(Store);
  #router = inject(Router);
  #actions = inject(Actions);

  loadMoreTmpl = viewChild<ElementRef<HTMLButtonElement>>('loadMoreTmpl');

  homeTweets$ = this.#store.pipe(
    select(selectAllTweets),
    tap(() => this.tweetsLoading.set(false)),
    map((tweets) =>
      tweets
        ?.slice()
        ?.sort((a, b) =>
          sortByCreatedTimeDesc(
            a.createdAt ?? (a as any).timestamp?.createdAt,
            b.createdAt ?? (b as any).timestamp?.createdAt
          )
        )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  followingProfiles = toSignal(
    this.#store.pipe(select(selectCurrentProfileFollowing))
  );
  homeTweetsLazyState = this.#store.selectSignal(selectTweetsLazyState);

  #loadingTweetsIntersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.#store
      .pipe(
        select(selectCurrentProfile),
        filter(Boolean),
        distinctUntilKeyChanged('id'),
        takeUntilDestroyed()
      )
      .subscribe(() =>
        this.#store.dispatch(
          TweetApiActions.getAll({ nextCursor: null, hasNextPage: null })
        )
      );

    effect(() => {
      const loadMoreTmpl = this.loadMoreTmpl();
      if (this.#loadingTweetsIntersectionObserver) {
        this.#loadingTweetsIntersectionObserver.disconnect();
      }
      if (!loadMoreTmpl) {
        return;
      }

      const { nextCursor, hasNextPage } = untracked(this.homeTweetsLazyState);

      if (!hasNextPage || !nextCursor) {
        return;
      }

      this.#loadingTweetsIntersectionObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) {
            return;
          }

          this.tweetsLoading.set(true);
          this.#store.dispatch(
            TweetApiActions.getAll({
              nextCursor,
              hasNextPage,
            })
          );
        }
      );

      // start observing
      this.#loadingTweetsIntersectionObserver.observe(
        loadMoreTmpl.nativeElement
      );
    });
  }

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
        }, DEFAULT_ANIMATE_TIMEOUT * 2);
      });
  }

  reloadTweets() {
    this.tweetsLoading.set(true);
    this.#reloadTweetsDisabled$$.next(true);
    this.#store.dispatch(
      TweetApiActions.getAll({ nextCursor: null, hasNextPage: null })
    );
  }

  tweetButtonHandler() {
    this.#router.navigate([
      { outlets: { [OUTLET_DIALOG]: [APP_PATH_DIALOG.Tweet] } },
    ]);
  }
}
