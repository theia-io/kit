import { Injectable, inject } from '@angular/core';
import {
  FeatTweetActions,
  FeatTweetBookmarkActions,
  selectAllTweets,
  selectBookmarks,
} from '@kitouch/features/tweet/data';
import { selectCurrentProfile } from '@kitouch/features/kit/ui';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class BookmarkEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  getBookmarks$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetBookmarkActions.getAll),
      withLatestFrom(this.currentProfile$),
      switchMap(([_, profile]) =>
        this.#tweetApi.getBookmarks(profile.id).pipe(
          map((bookmarks) =>
            FeatTweetBookmarkActions.getAllSuccess({
              bookmarks,
            })
          ),
          catchError((err) => {
            console.error('[BookmarkEffects] getBookmarks', err);
            return of(
              FeatTweetBookmarkActions.getAllFailure({
                message:
                  'Sorry, error. We will take a look at it and meanwhile try later',
              })
            );
          })
        )
      )
    )
  );

  getBookmarksFeed$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetBookmarkActions.getBookmarksFeed),
      map(({ bookmarks }) =>
        bookmarks.map((bookmark) => ({
          tweetId: bookmark.tweetId,
          profileId: bookmark.profileIdTweetyOwner,
        }))
      ),
      switchMap((tweetGetRequest) =>
        this.#tweetApi.get(tweetGetRequest).pipe(
          map((tweets) =>
            FeatTweetBookmarkActions.getBookmarksFeedSuccess({
              tweets,
            })
          ),
          catchError((err) => {
            console.error('[BookmarkEffects] getBookmarksFeed', err);
            return of(
              FeatTweetBookmarkActions.getBookmarksFeedFailure({
                message:
                  'Sorry, error. We will take a look at it and meanwhile try later',
              })
            );
          })
        )
      )
    )
  );

  bookmark$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetBookmarkActions.bookmark),
      withLatestFrom(this.currentProfile$),
      switchMap(([{ tweetId, profileIdTweetyOwner }, profile]) =>
        this.#tweetApi
          .bookmark({
            tweetId,
            profileIdTweetyOwner,
            profileIdBookmarker: profile.id,
          })
          .pipe(
            map((bookmark) =>
              FeatTweetBookmarkActions.bookmarkSuccess({
                bookmark,
              })
            ),
            catchError((err) => {
              console.error('[BookmarkEffects] bookmark', err);
              return of(
                FeatTweetBookmarkActions.bookmarkFailure({
                  tweetId,
                  message:
                    'Sorry, error. We will take a look at it and meanwhile try later',
                })
              );
            })
          )
      )
    )
  );

  deleteBookmark$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetBookmarkActions.removeBookmark),
      withLatestFrom(this.currentProfile$),
      switchMap(([{ tweetId }, profile]) =>
        this.#tweetApi
          .deleteBookmark({ profileIdBookmarker: profile.id, tweetId })
          .pipe(
            map((bookmark) =>
              FeatTweetBookmarkActions.removeBookmarkSuccess({
                bookmark,
              })
            ),
            catchError((err) => {
              console.error('[BookmarkEffects] deleteBookmark', err);
              return of(
                FeatTweetBookmarkActions.removeBookmarkFailure({
                  tweetId,
                  message:
                    'Sorry, error. We will take a look at it and meanwhile try later',
                })
              );
            })
          )
      )
    )
  );

  deleteBookmarkWhenTweetDeleted$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.deleteSuccess),
      map(({ ids }) =>
        /** @TODO @FIXME has to take into account deleteSuccess batch results  */
        FeatTweetBookmarkActions.removeBookmarkAsTweetRemoved({ tweetId: ids[0].tweetId })
      )
    )
  );
}