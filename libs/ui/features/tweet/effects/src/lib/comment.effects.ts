import { Injectable, inject } from '@angular/core';
import { selectCurrentProfile } from '@kitouch/kit-data';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
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
export class CommentsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #tweetApi = inject(TweetApiService);

  currentProfile$ = this.#store
    .select(selectCurrentProfile)
    .pipe(filter(Boolean));

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
            switchMap((tweet) =>
              tweet
                ? of(
                    FeatTweetActions.commentSuccess({
                      uuid,
                      tweet: { ...tweet, denormalization: { profile } },
                    })
                  )
                : throwError(
                    () => new Error('Cannot find such tweet to comment')
                  )
            ),
            catchError((err) => {
              console.error('[CommentsEffects] commentTweet', err);
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

  deleteCommentTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.commentDelete),
      switchMap(({ tweet, comment }) =>
        this.#tweetApi
          .deleteComment(tweet, comment)
          .pipe(
            map(() => FeatTweetActions.commentDeleteSuccess({ tweet, comment }))
          )
      ),
      catchError((err) => {
        console.error('[CommentsEffects] deleteCommentTweet', err);
        return of(
          FeatTweetActions.commentDeleteFailure({
            message:
              'Sorry, error. We will take a look at it and meanwhile try later.',
          })
        );
      })
    )
  );
}
