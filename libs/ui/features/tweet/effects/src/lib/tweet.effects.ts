import { Injectable, inject } from '@angular/core';
import { FeatTweetActions } from '@kitouch/feat-tweet-data';
import { AuthService } from '@kitouch/ui/shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class TweetsEffects {
  #actions$ = inject(Actions);
  #tweetApi = inject(TweetApiService);
  #auth = inject(AuthService);

  #realmUser$ = this.#auth.loggedInRealmUser$;
  currentProfileId$ = this.#auth.currentProfile$.pipe(
    tap((v) => console.log('currentProfileId', v)),
    map((profile) => (profile as any)._id)
  );

  allTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.getAll),
      switchMap(() =>
        this.#tweetApi.getAll().pipe(
          catchError((err) => {
            console.error('[TweetsEffects] allTweets ERROR', err);
            return [];
          })
        )
      ),
      map((tweets) => FeatTweetActions.setAll({ tweets }))
    )
  );

  createTweet$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(FeatTweetActions.create),
        withLatestFrom(this.currentProfileId$),
        switchMap(([{ content }, profileId]) =>
          this.#tweetApi.tweet({ profileId, content })
        )
      ),
    {
      dispatch: false,
    }
  );

  likeTweet$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatTweetActions.like),
      withLatestFrom(this.#realmUser$),
      switchMap(([{ tweet }, user]) =>
        this.#tweetApi
          .likeTweet((tweet as any)._id, '665f0331858ffd83be9e60e3')
          .pipe(
            catchError((err) => {
              console.error('[TweetsEffects] likeTweet ERROR', err);
              return [];
            })
          )
      ),
      map((tweet) => FeatTweetActions.set({ tweet }))
    )
  );
}
