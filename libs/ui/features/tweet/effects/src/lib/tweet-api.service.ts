import { Injectable, inject } from '@angular/core';
import { Bookmark, Profile, Tweety } from '@kitouch/shared/models';
import { AuthService } from '@kitouch/ui/shared';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap, take } from 'rxjs/operators';

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
      switchMap((user) => user.functions['getTweetsFeed']({ profileId, following }))
    );
  }

  getTweetsForProfile(profileId: string): Observable<Array<Tweety>> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getTweetsForProfile']({ profileId }))
    );
  }

  get(ids: Array<{tweetId: Tweety['id']; profileId: Profile['id']}>) {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getTweets'](ids))
    );
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['postTweet'](tweet))
    );
  }

  commentTweet(tweet: Partial<Tweety>) {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['putTweet'](tweet))
    );
  }

  likeTweet(tweet: Tweety) {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['putTweet'](tweet))
    );
  }

  getBookmarks(profileId: string): Observable<Array<Bookmark>> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['getBookmarks'](profileId))
    );
  }

  bookmark(bookmark: {
    tweetId: string;
    profileId: string;
  }): Observable<Bookmark> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['postBookmark'](bookmark))
    );
  }

  deleteBookmark(bookmark: {
    tweetId: string;
    profileId: string;
  }): Observable<Bookmark> {
    return this.#realmUser$.pipe(
      switchMap((user) => user.functions['deleteBookmark'](bookmark))
    );
  }
}
