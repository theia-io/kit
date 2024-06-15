import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tweety } from '@kitouch/shared/models';
import { AuthService } from '@kitouch/ui/shared';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetApiService {
  #http = inject(HttpClient);
  #auth = inject(AuthService);

  #realmUser$ = this.#auth.realmUser$.pipe(
    filter(Boolean),
    shareReplay(1),
    take(1)
  );

  getAll(profileId: string, following: string[]): Observable<Array<Tweety>> {
    return this.#realmUser$.pipe(
      switchMap((user) =>
        user.functions['allTweets']({profileId, following})
      )
    );
  }

  get(id: string) {
    return this.#realmUser$
      .pipe(
        switchMap((user) => user.functions['getTweet']({ id }))
      )
  }

  tweet(tweet: Partial<Tweety>): Observable<Tweety> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['postTweet']({ ...tweet }))
    );
  }

  likeTweet(tweetId: string, profileId: string) {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['putTweet']({ tweetId, profileId })),
      tap((v) => console.log('[TweetApiService] putTweet', v))
    );
  }
}
