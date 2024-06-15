import { Injectable, inject } from '@angular/core';
import { FeatTweetActions, TweetApiActions } from '@kitouch/feat-tweet-data';
import { AuthService } from '@kitouch/ui/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class TweetsEffects {
  #actions$ = inject(Actions);
  #tweetApi = inject(TweetApiService);
  #auth = inject(AuthService);

  currentProfile$ = this.#auth.currentProfile$;

  allTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.getAll),
      withLatestFrom(this.currentProfile$),
      switchMap(([_, profile]) =>
        this.#tweetApi
          .getAll(
            profile.id,
            profile.following.map((following) => following.id)
          )
          .pipe(
            map((tweets) => TweetApiActions.setAll({ tweets: tweets.map((tweet => {
              if(tweet.profileId === profile.id) {
                return {
                  ...tweet,
                  denormalization: {
                    profile
                  }
                }
              }
              return tweet;
            })) })),
            catchError((err) => {
              console.error('[TweetsEffects] allTweets ERROR', err);
              return of(TweetApiActions.getAllFailure());
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
        this.#tweetApi.tweet({ profileId: profile.id, content }).pipe(
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
      switchMap(([{ tweet }, profile]) =>
        this.#tweetApi.likeTweet(tweet.id, profile.id).pipe(
          map((tweet) =>
            FeatTweetActions.likeSuccess({
              tweet: { ...tweet, denormalization: { profile } },
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
