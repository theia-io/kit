import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  FeedResponse,
  Profile,
  TweetComment,
  Tweety,
} from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TweetV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getFeed(
    profileId: string,
    followingProfileIds: string[],
    cursor: string,
    limit = 10
  ): Observable<FeedResponse> {
    return this.#http.get<FeedResponse>(
      `${this.#environment.api.tweets}/feed/${profileId}`,
      {
        params: {
          followingProfileIds: JSON.stringify(followingProfileIds),
          limit,
          cursor,
        },
      }
    );
  }

  getTweetsForProfile(profileId: Profile['id']) {
    return this.getFeed(profileId, [], '', 999);
  }

  getTweet(
    tweetId: Tweety['id'],
    profileId: Profile['id']
  ): Observable<Tweety> {
    return this.#http.get<Tweety>(`${this.#environment.api.tweets}/tweet`, {
      params: {
        tweetId,
        profileId,
      },
    });
  }

  getTweets(
    ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>
  ): Observable<Array<Tweety>> {
    return this.#http.get<Array<Tweety>>(this.#environment.api.tweets, {
      params: {
        ids: JSON.stringify(ids),
      },
    });
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
    return this.#http.post<Tweety>(this.#environment.api.tweets, {
      ...tweet,
    });
  }

  deleteTweet(tweet: Tweety, profileId: string): Observable<boolean> {
    return this.#http.delete<boolean>(
      `${this.#environment.api.tweets}/${tweet.id}`,
      {
        params: {
          profileId,
        },
      }
    );
  }

  likeTweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    return this.#http.put(
      `${this.#environment.api.tweets}/${tweetId}/like`,
      null,
      {
        params: {
          profileId,
        },
      }
    );
  }

  commentTweet(
    tweetId: Tweety['id'],
    profileId: Profile['id'],
    content: string
  ) {
    return this.#http.post(
      `${this.#environment.api.tweets}/${tweetId}/comment`,
      {
        profileId,
        content,
      }
    );
  }

  deleteComment(tweetId: Tweety['id'], { profileId, content }: TweetComment) {
    return this.#http.delete<Tweety>(
      `${this.#environment.api.tweets}/${tweetId}/comment`,
      {
        params: {
          profileId,
          content,
        },
      }
    );
  }
}
