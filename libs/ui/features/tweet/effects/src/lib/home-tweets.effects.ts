import { Injectable, inject } from '@angular/core';
import { HomeTweetActions } from '@kitouch/feat-tweet-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TweetApiService } from './tweet-api.service';

@Injectable()
export class HomeTweetsEffects {
  #actions$ = inject(Actions);
  #tweetApi = inject(TweetApiService);

  allTweets$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(HomeTweetActions.getAll),
      tap((v) => console.log('homeGetAllTweet', v)),
      switchMap(() =>
        this.#tweetApi.getAll().pipe(
          catchError((err) => {
            console.error('[HomeTweetsEffects] ERROR', err);
            return [];
          })
        )
      ),
      map((tweets) => HomeTweetActions.setAll({ tweets }))
    )
  );
}
