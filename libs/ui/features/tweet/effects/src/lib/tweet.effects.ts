import { Injectable, inject } from '@angular/core';
import {
  FeatTweetActions,
  FeatTweetBookmarkActions,
  TweetApiActions,
  tweetIsLikedByProfile,
} from '@kitouch/feat-tweet-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class TweetsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  feedTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getAll),
      withLatestFrom(this.#currentProfile$),
      switchMap(([_, profile]) =>
        this.#tweetApi
          .getFeed(profile.id, profile.following?.map(({ id }) => id) ?? [])
          .pipe(
            map((tweets) =>
              TweetApiActions.getAllSuccess({
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
      ofType(FeatTweetBookmarkActions.getBookmarksFeedSuccess),
      map(({ tweets }) =>
        TweetApiActions.getTweetsForBookmarkSuccess({ tweets })
      )
    )
  );

  profileTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getTweetsForProfile),
      switchMap(({ profileId }) =>
        this.#tweetApi.getTweetsForProfile(profileId).pipe(
          map((tweets) =>
            TweetApiActions.getTweetsForProfileSuccess({ tweets })
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
        this.#tweetApi.get(tweetId, profileId).pipe(
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
          ? this.#tweetApi.deleteTweet(tweet).pipe(
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
        this.#tweetApi.newTweet({ profileId: profile.id, content }).pipe(
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
        this.#tweetApi
          .likeTweet({
            ...tweet,
            upProfileIds: tweetIsLikedByProfile(tweet, currentProfile.id)
              ? tweet.upProfileIds?.filter((id) => id !== currentProfile.id)
              : [currentProfile.id, ...(tweet.upProfileIds ?? [])],
          })
          .pipe(
            switchMap((tweet) =>
              tweet
                ? of(
                    FeatTweetActions.likeSuccess({
                      tweet,
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
