import { Injectable, inject } from '@angular/core';
import { FeatReTweetActions } from '@kitouch/feat-tweet-data';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { TweetyType } from '@kitouch/shared-models';
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
export class RetweetEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  retweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatReTweetActions.reTweet),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, profile]) =>
        this.#tweetApi
          .retweet(
            tweet.type === TweetyType.Tweet ? tweet.id : tweet.referenceId!,
            profile.id
          )
          .pipe(
            map((id) =>
              FeatReTweetActions.reTweetSuccess({
                tweet: {
                  ...tweet,
                  id,
                  referenceId: tweet.id,
                  profileId: tweet.profileId,
                  referenceProfileId: profile.id,
                  timestamp: {
                    createdAt: new Date(Date.now()),
                  },
                  type: TweetyType.Retweet,
                },
              })
            )
          )
      )
    )
  );

  deleteReTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatReTweetActions.delete),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, profile]) =>
        tweet.referenceProfileId === profile.id
          ? this.#tweetApi.deleteRetweet(tweet).pipe(
              map(() =>
                FeatReTweetActions.deleteSuccess({
                  tweet,
                })
              ),
              catchError((err) => {
                console.error('[RetweetEffects] deleteReTweet', err);
                return of(
                  FeatReTweetActions.deleteFailure({
                    message:
                      'It is not you, it is us. Let us know it does not work for you via support',
                  })
                );
              })
            )
          : of(
              FeatReTweetActions.deleteFailure({
                message: 'You can remove only your retweets',
              })
            )
      )
    )
  );
}
