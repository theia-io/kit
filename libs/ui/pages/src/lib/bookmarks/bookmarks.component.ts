import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  FeatTweetBookmarkActions,
  selectAllTweets,
  selectBookmarks
} from '@kitouch/features/tweet/data';
import { FeatTweetTweetyComponent } from '@kitouch/features/tweet/ui';
import { Bookmark, Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  TweetButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { APP_PATH } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import {combineLatest} from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-bookmarks',
  templateUrl: './bookmarks.component.html',
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
export class PageBookmarksComponent {
  #store = inject(Store);
  #router = inject(Router);

  bookmarkFeedTweets$ = combineLatest([
    this.#store
    .select(selectBookmarks),
    this.#store.select(selectAllTweets).pipe(
      // filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
    ),
  ])    
    .pipe(
      map(([bookmarks, tweets, ]) => {
        /** @TODO @FIXME */
        // likely should be memoized and improved
        const tweetsMap = new Map(tweets.map((tweet) => ([tweet.id, tweet])));
        return bookmarks.map((bookmark) => tweetsMap.get(bookmark.tweetId) ?? bookmark)
      }),
      filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
    );

  constructor() {
    this.#store
      .select(selectBookmarks)
      .pipe(
        filter(
          (bookmarks): bookmarks is Array<Bookmark> => bookmarks.length > 0
        ),
        /** @TODO @FIXME refine me */
        take(1), // this is needed once initial request for bookmarks returned
        takeUntilDestroyed()
      )
      .subscribe((bookmarks) => {
        this.#store.dispatch(
          FeatTweetBookmarkActions.getBookmarksFeed({ bookmarks })
        );
      });
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
}
