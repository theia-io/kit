import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '@kitouch/ui/shared';
import { shareReplay, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetApiService {
  #http = inject(HttpClient);
  #auth = inject(AuthService);

  #user$ = this.#auth.loggedInUser$.pipe(shareReplay(1), take(1));

  getAll() {
    return this.#user$.pipe(
      switchMap((user) => user.functions['allTweets']()),
      tap((v) => console.log('[TweetApiService] getAll', v))
    );
  }

  likeTweet(tweetId: string, profileId: string) {
    return this.#user$.pipe(
      switchMap((user) => user.functions['likeTweet']({ tweetId, profileId })),
      tap((v) => console.log('[TweetApiService] likeTweet', v)),
    );
  }
}
