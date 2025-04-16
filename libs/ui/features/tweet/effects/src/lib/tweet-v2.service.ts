import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  Bookmark,
  Profile,
  TweetComment,
  Tweety,
  TweetyType,
} from '@kitouch/shared-models';
import { BSON } from 'realm-web';
import { Observable, of } from 'rxjs';

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
      `${this.#environment.api.tweets}/feed`,
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
    const newTweet = {
      ...tweet,
      profileId: new BSON.ObjectId(tweet.profileId),
      type: TweetyType.Tweet,
    };

    return this.#http.post<Tweety>(this.#environment.api.tweets, {
      ...newTweet,
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
    return this.#http.delete(
      `${this.#environment.api.tweets}/${tweetId}/comment`,
      {
        params: {
          profileId,
          content,
        },
      }
    );
  }

  getBookmarks(profileId: Profile['id']): Observable<Array<Bookmark>> {
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection('bookmark').find(
    //       {
    //         profileIdBookmarker: new BSON.ObjectId(profileId),
    //       },
    //       {
    //         sort: {
    //           'timestamp.createdAt': -1,
    //         },
    //       }
    //     )
    //   ),
    //   map((bookmarks) => bookmarks.map(dbClientBookmarkAdapter))
    // );
    return of([] as any);
  }

  bookmark(bookmark: Partial<Bookmark>): Observable<Bookmark> {
    // const dbBookmark = {
    //   ...bookmark,
    //   tweetId: new BSON.ObjectId(bookmark.tweetId),
    //   profileIdTweetyOwner: new BSON.ObjectId(bookmark.profileIdTweetyOwner),
    //   profileIdBookmarker: new BSON.ObjectId(bookmark.profileIdBookmarker),
    //   timestamp: {
    //     createdAt: new Date(Date.now()),
    //   },
    // } as any;
    // return this.db$().pipe(
    //   switchMap((db) => db.collection('bookmark').insertOne(dbBookmark)),
    //   map(({ insertedId }) =>
    //     dbClientBookmarkAdapter({
    //       ...dbBookmark,
    //       _id: insertedId,
    //     })
    //   )
    // );
    return of({} as any);
  }

  /** @TODO
   * We should not delete bookmarks when Tweet get's deleted? (or we should)?
   */
  deleteBookmark({
    tweetId,
    profileIdBookmarker,
  }: {
    tweetId: Tweety['id'];
    profileIdBookmarker: Profile['id'];
  }): Observable<boolean> {
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection('bookmark').deleteOne({
    //       tweetId: new BSON.ObjectId(tweetId),
    //       profileIdBookmarker: new BSON.ObjectId(profileIdBookmarker),
    //     })
    //   ),
    //   map(({ deletedCount }) => deletedCount > 0)
    // );
    return of(true);
  }

  #deleteAllTweetBookmarks(tweetId: Tweety['id']): Observable<boolean> {
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection('bookmark').deleteMany({
    //       tweetId: new BSON.ObjectId(tweetId),
    //     })
    //   ),
    //   map(({ deletedCount }) => deletedCount > 0)
    // );
    return of(true);
  }

  retweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    // return this.db$().pipe(
    //   switchMap((db) =>
    //     db.collection('retweet').insertOne({
    //       tweetId: new BSON.ObjectId(tweetId),
    //       profileId: new BSON.ObjectId(profileId),
    //       ...clientDBGenerateTimestamp(),
    //     })
    //   ),
    //   map(({ insertedId }) => insertedId.toString())
    // );
    return of({} as any);
  }

  #updateTweet(tweet: Partial<Tweety>) {
    return this.#http.put<Tweety>(
      `${this.#environment.api.tweets}/${tweet.id}/content`,
      {
        ...tweet,
      }
    );
  }
}
