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
  #auth = inject(AuthService);

  #realmUser$ = this.#auth.realmUser$.pipe(
    filter(Boolean),
    shareReplay(1),
    take(1)
  );

  getFeed(profileId: string, following: string[]): Observable<Array<Tweety>> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getTweets']({ profileId, following }))
    );
  }

  getAllProfile(profileId: string): Observable<Array<Tweety>> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getTweetsProfile']({ profileId }))
    );
  }

  get(tweetId: string, profileId: string) {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getTweet']({ tweetId, profileId }))
    );
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
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
