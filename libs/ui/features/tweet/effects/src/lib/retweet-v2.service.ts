import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Profile, ReTweety, Tweety } from '@kitouch/shared-models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReTweetV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  retweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    return this.#http.post<ReTweety>(`${this.#environment.api.retweets}`, {
      tweetId,
      profileId,
    });
  }

  deleteRetweet(retweet: Tweety, profileId: string): Observable<boolean> {
    return this.#http.delete<boolean>(
      `${this.#environment.api.retweets}/${retweet.id}`,
      {
        params: {
          profileId,
        },
      }
    );
  }

  deleteRetweets(tweetId: string): Observable<boolean> {
    return this.#http.delete<boolean>(`${this.#environment.api.retweets}`, {
      params: {
        tweetId,
      },
    });
  }

  #updateTweet(tweet: Partial<Tweety>) {
    // const { id, type, profileId, createdAt: ___, updatedAt: __, deletedAt: _, ...tweetRest } = tweet;
    // return this.db$().pipe(
    //   switchMap((db) => {
    //     const collection =
    //       type === TweetyType.Retweet
    //         ? db.collection<DBClientType<Tweety>>('retweet')
    //         : db.collection<DBClientType<Tweety>>('tweet');
    //     return collection.findOneAndUpdate(
    //       {
    //         _id: new BSON.ObjectId(id),
    //       },
    //       {
    //         $set: tweetRest,
    //         $currentDate: {
    //           'updatedAt': true,
    //         },
    //       },
    //       {
    //         returnNewDocument: true,
    //       }
    //     );
    //   }),
    //   map((dbTweet) => (dbTweet ? dbClientTweetAdapter(dbTweet) : dbTweet))
    // );
    return of({} as any);
  }
}
