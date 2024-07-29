import { Injectable } from '@angular/core';
import {
  Bookmark,
  Profile,
  TweetComment,
  Tweety,
} from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui/shared';
import { BSON } from 'realm-web';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetApiService extends DataSourceService {
  getFeed(profileId: string, following: string[]): Observable<Array<Tweety>> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['getTweetsFeed']({ profileId, following }))
    );
  }

  getTweetsForProfile(profileId: string): Observable<Array<Tweety>> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['getTweetsForProfile']({ profileId }))
    );
  }

  get(ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>) {
    return this.realmFunctions$().pipe(switchMap((fn) => fn['getTweets'](ids)));
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
    return this.realmFunctions$().pipe(switchMap((fn) => fn['postTweet'](tweet)));
  }

  deleteTweets(
    ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>
  ): Observable<Tweety> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['deleteTweets'](ids))
    );
  }

  commentTweet(tweet: Partial<Tweety>) {
    return this.realmFunctions$().pipe(switchMap((fn) => fn['putTweet'](tweet)));
  }

  deleteComment(
    tweet: Tweety,
    { profileId, content, createdAt }: TweetComment
  ) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<Tweety>('tweet').updateOne(
          { _id: new BSON.ObjectId(tweet.id) },
          {
            $pull: {
              comments: {
                profileId,
                content,
                createdAt,
              },
            },
          }
        )
      )
    );
  }

  likeTweet(tweet: Tweety) {
    return this.realmFunctions$().pipe(switchMap((fn) => fn['putTweet'](tweet)));
  }

  getBookmarks(profileId: Profile['id']): Observable<Array<Bookmark>> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['getBookmarks'](profileId))
    );
  }

  bookmark(bookmark: Omit<Bookmark, 'id'>): Observable<Bookmark> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['postBookmark'](bookmark))
    );
  }

  deleteBookmark(bookmark: {
    tweetId: Tweety['id'];
    profileIdBookmarker: Profile['id'];
  }): Observable<Bookmark> {
    return this.realmFunctions$().pipe(
      switchMap((fn) => fn['deleteBookmark'](bookmark))
    );
  }

  retweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    return this.db$()
      .pipe(
        switchMap((db) => db.collection('retweet').insertOne({
          tweetId: new BSON.ObjectId(tweetId),
          profileId: new BSON.ObjectId(profileId),
          timestamp: {
            createdAt: (new Date(Date.now())),
            updatedAt: (new Date(Date.now()))
          }
        }))
      )
  }
}
