import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FeatTweetActions, selectTweet } from '@kitouch/feat-tweet-data';
import {
  selectCurrentProfile,
  selectProfile,
} from '@kitouch/features/kit/data';
import { Tweety } from '@kitouch/shared/models';
import { AccountTileComponent } from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import {
  ReplaySubject,
  Subject,
  combineLatestWith,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { FeatTweetActionsComponent } from './actions/actions.component';
import { tweetIsLikedByProfile } from '@kitouch/feat-tweet-effects';

@Component({
  standalone: true,
  selector: 'feat-tweet-tweety',
  templateUrl: './tweety.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    AsyncPipe,
    //
    FeatTweetActionsComponent,
    AccountTileComponent,
  ],
})
export class FeatTweetTweetyComponent implements OnInit {
  @Input({ required: true })
  tweet!: Tweety; /** @TODO @FIXME think on converting to tweet id */

  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #store = inject(Store);

  domSanitizer = inject(DomSanitizer);

  #currentProfile$ = this.#store.select(selectCurrentProfile).pipe(filter(Boolean));

  #tweet$$ = new ReplaySubject<Tweety>(1);

  tweetProfile$ = this.#tweet$$.pipe(
    switchMap((tweet) => this.#store.select(selectProfile(tweet.profileId))),
    startWith(this.tweet?.denormalization?.profile ?? undefined),
    filter(Boolean),
  );

  tweetLiked$ = this.#tweet$$.pipe(
    combineLatestWith(this.#currentProfile$),
    map(([tweet, currentProfile]) =>
      tweetIsLikedByProfile(tweet, currentProfile?.id)
    ),
  );

  profileUrlPath = `/${APP_PATH.Profile}/`;

  ngOnInit(): void {
    if (this.tweet.id) {
      this.#store
        .select(selectTweet(this.tweet.id))
        .pipe(filter(Boolean), takeUntilDestroyed(this.#destroyRef))
        .subscribe((tweet) => {
          this.#tweet$$.next(tweet);
        });
    }
  }

  tweetClickHandler(tweet: Tweety) {
    this.#router.navigate([
      '/',
      APP_PATH.Profile,
      tweet.profileId,
      APP_PATH.Tweet,
      tweet.id,
    ]);
  }

  commentHandler() {
    console.info('Implement commentHandler');
  }

  repostHandler() {
    console.info('Implement repostHandler');
  }

  likeHandler() {
    this.#store.dispatch(FeatTweetActions.like({ tweet: this.tweet }));
  }

  shareHandler() {
    console.info('Implement shareHandler');
  }

  bookmarkHandler() {
    console.info('Implement bookmarkHandler');
  }
}
