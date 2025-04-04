import { inject, Injectable } from '@angular/core';
import {
  FeatTweetActions,
  FeatBookmarksActions,
} from '@kitouch/feat-tweet-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  distinctUntilKeyChanged,
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
      ofType(FeatBookmarksActions.getAll),
      withLatestFrom(this.currentProfile$),
      switchMap(([_, profile]) =>
        this.#tweetApi.getBookmarks(profile.id).pipe(
          map((bookmarks) =>
            FeatBookmarksActions.getAllSuccess({
              bookmarks,
            })
          ),
          catchError((err) => {
            console.error('[BookmarkEffects] getBookmarks', err);
            return of(
              FeatBookmarksActions.getAllFailure({
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
      ofType(FeatBookmarksActions.getBookmarksFeed),
      map(({ bookmarks }) =>
        bookmarks.map((bookmark) => ({
          tweetId: bookmark.tweetId,
          profileId: bookmark.profileIdTweetyOwner,
        }))
      ),
      switchMap((tweetGetRequest) =>
        this.#tweetApi.getMany(tweetGetRequest).pipe(
          map((tweets) =>
            FeatBookmarksActions.getBookmarksFeedSuccess({
              tweets,
            })
          ),
          catchError((err) => {
            console.error('[BookmarkEffects] getBookmarksFeed', err);
            return of(
              FeatBookmarksActions.getBookmarksFeedFailure({
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
      ofType(FeatBookmarksActions.bookmark),
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
              FeatBookmarksActions.bookmarkSuccess({
                bookmark,
              })
            ),
            catchError((err) => {
              console.error('[BookmarkEffects] bookmark', err);
              return of(
                FeatBookmarksActions.bookmarkFailure({
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
      ofType(FeatBookmarksActions.removeBookmark),
      withLatestFrom(this.currentProfile$),
      switchMap(([{ tweetId }, { id }]) =>
        this.#tweetApi
          .deleteBookmark({ profileIdBookmarker: id, tweetId })
          .pipe(
            map(() =>
              FeatBookmarksActions.removeBookmarkSuccess({
                tweetId,
                profileId: id,
              })
            ),
            catchError((err) => {
              console.error('[BookmarkEffects] deleteBookmark', err);
              return of(
                FeatBookmarksActions.removeBookmarkFailure({
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
      map(({ tweet: { id } }) =>
        /** @TODO @FIXME has to take into account deleteSuccess batch results  */
        FeatBookmarksActions.removeBookmarkAsTweetRemoved({
          tweetId: id,
        })
      )
    )
  );

  constructor() {
    this.currentProfile$
      .pipe(distinctUntilKeyChanged('id'))
      .subscribe(() => this.#store.dispatch(FeatBookmarksActions.getAll()));
  }
}
