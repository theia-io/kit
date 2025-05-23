import { Injectable, inject } from '@angular/core';
import {
  FeatBookmarksActions,
  FeatTweetActions,
  TweetApiActions,
} from '@kitouch/feat-tweet-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { TweetV2Service } from './tweet-v2.service';

@Injectable()
export class TweetsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetV2Service = inject(TweetV2Service);

  #currentProfile$ = this.#store.select(selectCurrentProfile).pipe(
    filter(Boolean),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  feedTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getAll),
      withLatestFrom(this.#currentProfile$.pipe(take(1))),
      switchMap(([{ nextCursor }, profile]) =>
        this.#tweetV2Service
          .getFeed(
            profile.id,
            profile.following?.map(({ id }) => id) ?? [],
            nextCursor ?? ''
          )
          .pipe(
            map(({ tweets, nextCursor, hasNextPage }) =>
              TweetApiActions.getAllSuccess({
                nextCursor,
                hasNextPage,
                tweets: tweets.map((tweet) => {
                  if (tweet.profileId === profile.id) {
                    return {
                      ...tweet,
                      denormalization: {
                        profile,
                      },
                    };
                  }
                  return tweet;
                }),
              })
            ),
            catchError((err) => {
              console.error('[TweetsEffects] allTweets ERROR', err);
              return of(TweetApiActions.getAllFailure());
            })
          )
      )
    )
  );

  bookmarkFeedSuccess$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatBookmarksActions.getBookmarksFeedSuccess),
      map(({ tweets }) =>
        TweetApiActions.getTweetsForBookmarkSuccess({
          tweets,
        })
      )
    )
  );

  profileTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getTweetsForProfile),
      switchMap(({ profileId }) =>
        this.#tweetV2Service.getTweetsForProfile(profileId).pipe(
          map(({ tweets, hasNextPage, nextCursor }) =>
            TweetApiActions.getTweetsForProfileSuccess({
              tweets,
              hasNextPage,
              nextCursor,
            })
          ),
          catchError((err) => {
            console.error('[TweetsEffects] profileTweets ERROR', err);
            return of(
              TweetApiActions.getTweetsForProfileFailure({ profileId })
            );
          })
        )
      )
    )
  );

  getTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.get),
      switchMap(({ tweetId, profileId }) =>
        this.#tweetV2Service.getTweet(tweetId, profileId).pipe(
          map((tweet) => TweetApiActions.getSuccess({ tweet })),
          catchError((err) => {
            console.error('[TweetsEffects] getTweet ERROR', err);
            return of(TweetApiActions.getFailure({ tweetId, profileId }));
          })
        )
      )
    )
  );

  deleteTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.delete),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, profile]) =>
        tweet.profileId === profile.id
          ? this.#tweetV2Service.deleteTweet(tweet, profile.id).pipe(
              map(() => FeatTweetActions.deleteSuccess({ tweet })),
              catchError((err) => {
                console.error('[TweetsEffects] deleteTweet ERROR', err);
                return of(
                  FeatTweetActions.deleteFailure({
                    message: 'Cannot delete tweet right now.',
                  })
                );
              })
            )
          : of(
              FeatTweetActions.deleteFailure({
                message: 'You can delete only your own tweets',
              })
            )
      )
    )
  );

  createTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.tweet),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ uuid, content }, profile]) =>
        this.#tweetV2Service.newTweet({ profileId: profile.id, content }).pipe(
          map((tweet) =>
            FeatTweetActions.tweetSuccess({
              uuid,
              tweet: { ...tweet, denormalization: { profile } },
            })
          ),
          catchError((err) => {
            console.error('TweetsEffects createTweet', err);
            return of(
              FeatTweetActions.tweetFailure({
                uuid,
                message:
                  'Sorry, error. We will take a look at it and meanwhile try later',
              })
            );
          })
        )
      )
    )
  );

  likeTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.like),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, currentProfile]) =>
        this.#tweetV2Service.likeTweet(tweet.id, currentProfile.id).pipe(
          switchMap((likedTweet) =>
            likedTweet
              ? of(
                  FeatTweetActions.likeSuccess({
                    tweet: {
                      ...tweet,
                      ...likedTweet,
                    },
                  })
                )
              : throwError(() => new Error('Cannot find such tweet to like'))
          ),
          catchError((err) => {
            console.error('[TweetsEffects] likeTweet ERROR', err);
            return of(FeatTweetActions.likeFailure({ tweet }));
          })
        )
      )
    )
  );
}
