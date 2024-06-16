import { Injectable, inject } from '@angular/core';
import { FeatTweetActions, TweetApiActions } from '@kitouch/feat-tweet-data';
import { selectCurrentProfile } from '@kitouch/features/kit/ui';
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
import { tweetIsLikedByProfile } from './like';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class TweetsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  allTweets$ = createEffect(() =>
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

  profileTweets = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getProfileTweets),
      switchMap(({ profileId }) =>
        this.#tweetApi.getProfileTweets(profileId).pipe(
          map((tweets) => TweetApiActions.getProfileTweetsSuccess({ tweets })),
          catchError((err) => {
            console.error('[TweetsEffects] profileTweets ERROR', err);
            return of(TweetApiActions.getProfileTweetsFailure({ profileId }));
          })
        )
      )
    )
  );

  tweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.get),
      switchMap(({ tweetId, profileId }) =>
        this.#tweetApi.get(tweetId, profileId).pipe(
          map((tweet) => TweetApiActions.getSuccess({ tweet })),
          catchError((err) => {
            console.error('[TweetsEffects] tweet ERROR', err);
            return of(TweetApiActions.getFailure({ tweetId, profileId }));
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
