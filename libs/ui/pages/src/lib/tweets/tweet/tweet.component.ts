import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TweetApiActions, selectTweet } from '@kitouch/feat-tweet-data';
import { Tweety } from '@kitouch/shared/models';
import { UiCompCardComponent } from '@kitouch/ui/components';
import { FeatTweetTweetyComponent } from '@kitouch/ui/features/tweet';
import { Store } from '@ngrx/store';
import { profile } from 'console';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';

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

  #ids$ = this.#activatedRouter.params.pipe(
    tap((params) => console.log(params)),
    map((params) => ({tweetId: params['id'], profileId: params['profileId']})),
  );

  tweet$ = this.#ids$.pipe(
    switchMap(({tweetId}) => this.#store.select(selectTweet(tweetId))),
    filter((tweet): tweet is Tweety => !!tweet),
    shareReplay(),
  );

  constructor() {
    this.#ids$
      .pipe(takeUntilDestroyed())
      .subscribe(({tweetId, profileId}) =>
        this.#store.dispatch(TweetApiActions.get({ tweetId, profileId }))
      );
  }
}
