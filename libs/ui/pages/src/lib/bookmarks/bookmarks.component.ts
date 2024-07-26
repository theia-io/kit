import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FeatTweetBookmarkActions,
  selectAllTweets,
  selectBookmarks,
} from '@kitouch/features/tweet/data';
import { FeatTweetTweetyComponent } from '@kitouch/features/tweet/ui';
import { Bookmark, Tweety } from '@kitouch/shared/models';
import {
  AccountTileComponent,
  DividerComponent,
  UiKitTweetButtonComponent,
  UiCompCardComponent,
} from '@kitouch/ui/components';
import { QuotesService } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { combineLatest, interval, merge, of } from 'rxjs';
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
    UiKitTweetButtonComponent,
  ],
})
export class PageBookmarksComponent {
  #store = inject(Store);
  #quotesService = inject(QuotesService);

  bookmarkFeedTweets$ = combineLatest([
    this.#store.select(selectBookmarks),
    this.#store
      .select(selectAllTweets)
      .pipe
      // filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
      (),
  ]).pipe(
    map(([bookmarks, tweets]) => {
      /** @TODO @FIXME */
      // likely should be memoized and improved
      const tweetsMap = new Map(tweets.map((tweet) => [tweet.id, tweet]));
      return bookmarks.map(
        (bookmark) => tweetsMap.get(bookmark.tweetId) ?? bookmark
      );
    }),
    filter((tweets): tweets is Array<Tweety> => tweets.length > 0)
  );

  // Instead of QUOTE I might be able to suggest most trending tweets?
  quote$ = merge(of(null), interval(10_000)).pipe(
    switchMap(() => this.#quotesService.getRandomQuote())
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
}
