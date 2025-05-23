import { AsyncPipe, CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FeatBookmarksActions,
  selectAllTweets,
  selectBookmarks,
} from '@kitouch/feat-tweet-data';
import { FeatTweetTweetyComponent } from '@kitouch/feat-tweet-ui';
import { Bookmark, Tweety } from '@kitouch/shared-models';
import { QuotesService, sortByCreatedTimeDesc } from '@kitouch/shared-services';
import { DividerComponent, UiCompCardComponent } from '@kitouch/ui-components';

import { Store } from '@ngrx/store';
import { combineLatest, interval, merge, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'kit-page-bookmarks',
  templateUrl: './bookmarks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    AsyncPipe,
    NgClass,
    //
    UiCompCardComponent,
    FeatTweetTweetyComponent,
    DividerComponent,
  ],
})
export class PageBookmarksComponent {
  #store = inject(Store);
  #quotesService = inject(QuotesService);

  bookmarkFeedTweets$ = combineLatest([
    this.#store.select(selectBookmarks),
    this.#store.select(selectAllTweets),
    // .pipe
    // // filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
    // (),
  ]).pipe(
    map(([bookmarks, tweets]) => {
      /** @TODO @FIXME */
      // likely should be memoized and improved
      const tweetsMap = new Map(tweets.map((tweet) => [tweet.id, tweet]));
      return bookmarks
        .slice()
        .sort((a, b) => sortByCreatedTimeDesc(a.createdAt, b.createdAt))
        .map((bookmark) => tweetsMap.get(bookmark.tweetId) ?? bookmark);
    }),
    filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
  );

  // Instead of QUOTE I might be able to suggest most trending tweets?
  quote$ = merge(of(null), interval(10_000)).pipe(
    switchMap(() => this.#quotesService.getRandomQuote())
  );

  bookmarkIconOver = signal<any>({});

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
          FeatBookmarksActions.getBookmarksFeed({ bookmarks })
        );
      });
  }

  mouseOver(bookmarkId: Bookmark['id']) {
    this.bookmarkIconOver.update((prev: object) => {
      return {
        ...prev,
        [bookmarkId]: true,
      };
    });
  }

  mouseLeave(bookmarkId: Bookmark['id']) {
    this.bookmarkIconOver.update((prev: object) => {
      return {
        ...prev,
        [bookmarkId]: false,
      };
    });
  }
}
