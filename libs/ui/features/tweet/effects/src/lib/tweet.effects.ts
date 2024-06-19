import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/features/kit/ui';
import {
  FeatTweetActions,
  FeatTweetBookmarkActions,
  TweetApiActions,
  tweetIsLikedByProfile,
} from '@kitouch/features/tweet/data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
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
export class TweetsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  feedTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getAll),
      withLatestFrom(this.currentProfile$),
      switchMap(([_, profile]) =>
        this.#tweetApi
          .getFeed(
            profile.id,
            profile.following.map((followingId) => followingId)
          )
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

  bookmarkTweets$ = createEffect(() =>
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

  getTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.get),
      switchMap(({ ids }) =>
        this.#tweetApi.get(ids).pipe(
          map((tweets) => TweetApiActions.getSuccess({ tweets })),
          catchError((err) => {
            console.error('[TweetsEffects] tweet ERROR', err);
            return of(TweetApiActions.getFailure({ ids }));
          })
        )
      )
    )
  );

  deleteTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.delete),
      switchMap(({ ids }) =>
        this.#tweetApi.deleteTweets(ids).pipe(
          map(() => FeatTweetActions.deleteSuccess({ ids })),
          catchError((err) => {
            console.error('[TweetsEffects] deleteTweets ERROR', err);
            return of(FeatTweetActions.deleteFailure({ ids }));
          })
        )
      )
    )
  );

  createTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.tweet),
      withLatestFrom(this.currentProfile$),
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

  commentTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.comment),
      withLatestFrom(this.currentProfile$),
      switchMap(([{ uuid, tweet, content }, profile]) =>
        this.#tweetApi
          .commentTweet({
            ...tweet,
            comments: [
              {
                profileId: profile.id,
                content,
              },
              ...(tweet.comments ?? []),
            ],
          })
          .pipe(
            map((tweet) =>
              FeatTweetActions.commentSuccess({
                uuid,
                tweet: { ...tweet, denormalization: { profile } },
              })
            ),
            catchError((err) => {
              console.error('TweetsEffects commentTweet', err);
              return of(
                FeatTweetActions.commentFailure({
                  uuid,
                  tweet,
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
      withLatestFrom(this.currentProfile$),
      switchMap(([{ tweet }, currentProfile]) =>
        this.#tweetApi
          .likeTweet({
            ...tweet,
            upProfileIds: tweetIsLikedByProfile(tweet, currentProfile.id)
              ? tweet.upProfileIds.filter((id) => id !== currentProfile.id)
              : [currentProfile.id, ...(tweet.upProfileIds ?? [])],
          })
          .pipe(
            map((tweet) =>
              FeatTweetActions.likeSuccess({
                tweet,
              })
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
