import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TweetApiActions, selectTweet } from '@kitouch/feat-tweet-data';
import { Tweety } from '@kitouch/shared/models';
import { UiCompCardComponent } from '@kitouch/ui/components';
import { FeatTweetTweetyComponent } from '@kitouch/ui/features/tweet';
import { Store } from '@ngrx/store';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-tweet',
  templateUrl: './tweet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    // 
    UiCompCardComponent,
    FeatTweetTweetyComponent
  ],
})
export class PageTweetComponent {
  #activatedRouter = inject(ActivatedRoute);
  #store = inject(Store);

  #tweetId$ = this.#activatedRouter.params.pipe(
    map((params) => params['id']),
  );

  tweet$ = this.#tweetId$.pipe(
    switchMap((id) => this.#store.select(selectTweet(id))),
    filter((tweet): tweet is Tweety => !!tweet),
    shareReplay(),
  );

  constructor() {
    this.tweet$.pipe(takeUntilDestroyed()).subscribe((tweet) => console.log('tweet', tweet));
    this.#tweetId$
      .pipe(takeUntilDestroyed())
      .subscribe((tweetId) =>
        this.#store.dispatch(TweetApiActions.get({ id: tweetId }))
      );
  }
}
