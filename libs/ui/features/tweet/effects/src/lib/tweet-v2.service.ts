import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Profile, Tweety, TweetyType } from '@kitouch/shared-models';
import { Observable } from 'rxjs';
import { BSON } from 'realm-web';

@Injectable({
  providedIn: 'root',
})
export class TweetV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getFeed(
    profileId: string,
    followingProfileIds?: string[]
  ): Observable<Array<Tweety>> {
    return this.#http.get<Array<Tweety>>(
      `${this.#environment.api.tweet}/feed`,
      {
        params: {
          profileId,
          followingProfileIds: followingProfileIds ?? [],
        },
      }
    );
  }

  getTweetsForProfile(profileId: Profile['id']) {
    return this.getFeed(profileId);
  }

  getTweet(
    tweetId: Tweety['id'],
    profileId: Profile['id']
  ): Observable<Tweety> {
    return this.#http.get<Tweety>(`${this.#environment.api.tweet}/tweet`, {
      params: {
        tweetId,
        profileId,
      },
    });
  }

  getTweets(
    ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>
  ): Observable<Array<Tweety>> {
    return this.#http.get<Array<Tweety>>(this.#environment.api.tweet, {
      params: {
        ids: JSON.stringify(ids),
      },
    });
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
    const newTweet = {
      ...tweet,
      profileId: new BSON.ObjectId(tweet.profileId),
      type: TweetyType.Tweet,
    };

    return this.#http.post<Tweety>(this.#environment.api.tweet, {
      body: newTweet,
    });
  }
}
