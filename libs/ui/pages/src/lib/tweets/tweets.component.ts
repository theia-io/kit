import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TweetApiActions,
  selectTweetsProfile
} from '@kitouch/feat-tweet-data';
import { Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  TweetButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { FeatTweetTweetyComponent } from '@kitouch/ui/features/tweet';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { filter, map, shareReplay, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'kit-page-tweets',
  templateUrl: './tweets.component.html',
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
export class PageTweetsComponent {
  #store = inject(Store);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  #profileId$ = this.#activatedRouter.params.pipe(
    map((params) => params['profileId']),
    shareReplay()
  );

  tweets$ = this.#profileId$.pipe(
    switchMap((profileId) => this.#store.select(selectTweetsProfile(profileId))),
    filter((tweets): tweets is Array<Tweety> => tweets.length > 0),
  );

  constructor() {
    this.#profileId$
      .pipe(takeUntilDestroyed())
      .subscribe((profileId) =>
        this.#store.dispatch(TweetApiActions.getProfileTweets({ profileId }))
      );
  }

  tweetHandler(tweet: Tweety) {
    this.#router.navigate([
      '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.id,
    ]);
  }
}
