import { Injectable, inject } from '@angular/core';
import { FeatReTweetActions, FeatTweetActions } from '@kitouch/feat-tweet-data';
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
import { ReTweetV2Service } from './retweet-v2.service';

@Injectable()
export class RetweetEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #retweetV2Service = inject(ReTweetV2Service);

  #currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

  retweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatReTweetActions.reTweet),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, profile]) =>
        this.#retweetV2Service.retweet(tweet.id, profile.id).pipe(
          map((retweet) =>
            FeatReTweetActions.reTweetSuccess({
              tweet: {
                ...tweet,
                ...retweet,
                tweetId: tweet.id,
                retweetedProfileId: retweet.profileId,
                type: TweetyType.Retweet,
                createdAt: retweet.createdAt,
              },
            })
          )
        )
      )
    )
  );

  deleteTweetSuccess$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(FeatTweetActions.deleteSuccess),
        switchMap(
          ({ tweet }) => this.#retweetV2Service.deleteRetweets(tweet.id)
          // TODO Add handling for user to show that some of his retweets might have been deleted
        )
      ),
    {
      dispatch: false,
    }
  );

  deleteReTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatReTweetActions.delete),
      withLatestFrom(this.#currentProfile$),
      switchMap(([{ tweet }, profile]) =>
        tweet.retweetedProfileId === profile.id
          ? this.#retweetV2Service.deleteRetweet(tweet, profile.id).pipe(
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
