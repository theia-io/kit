import { Injectable } from '@angular/core';
import {
  dbClientBookmarkAdapter,
  dbClientTweetAdapter,
} from '@kitouch/feat-tweet-data';
import { dbClientProfileAdapter } from '@kitouch/kit-data';
import {
  Bookmark,
  Profile,
  TweetComment,
  Tweety,
  TweetyType,
} from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { clientDBIdAdapter, DBClientType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetApiService extends DataSourceService {
  getFeed(
    profileId: string,
    followingProfileIds: string[]
  ): Observable<Array<Tweety>> {
    const agg = [
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'retweet',
            localField: '_id',
            foreignField: 'tweetId',
            as: 'retweetsData',
            pipeline: [
              {
                $match: {
                  $or: [
                    {
                      profileId: clientDBIdAdapter(profileId),
                    },
                    {
                      profileId: {
                        $in: followingProfileIds.map(clientDBIdAdapter),
                      },
                    },
                  ],
                },
              },
            ],
          },
      },
      {
        $facet:
          /**
           * outputFieldN: The first output field.
           * stageN: The first aggregation stage.
           */
          {
            original: [
              {
                $replaceRoot: {
                  newRoot: '$$ROOT',
                },
              },
              {
                $addFields: {
                  type: 'tweet',
                },
              },
              { $unset: ['retweetsData'] },
            ],
            // Keep original document
            unwound: [
              {
                $unwind: '$retweetsData',
              },
              {
                $match: {
                  'retweetsData._id': {
                    $exists: true,
                  },
                },
              },
              {
                $project: {
                  _id: '$retweetsData._id',
                  referenceId: '$retweetsData.tweetId',
                  referenceProfileId: '$retweetsData.profileId',
                  timestamp: '$retweetsData.timestamp',
                  type: 'retweet',
                  // Get from the original tweet
                  profileId: '$profileId',
                  content: '$content',
                  upProfileIds: '$retweetsData.upProfileIds',
                },
              },
            ], // Unwind the array: [ stageN, ... ]
          },
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            allDocs: {
              $concatArrays: ['$original', '$unwound'],
            },
          },
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$allDocs',
          },
      },
      {
        $replaceWith:
          /**
           * replacementDocument: A document or string.
           */
          '$allDocs',
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            $or: [
              {
                profileId: clientDBIdAdapter(profileId),
              },
              {
                profileId: {
                  $in: followingProfileIds.map(clientDBIdAdapter),
                },
              },
            ],
          },
      },
      { $sort: { 'timestamp.createdAt': -1 } },
    ];

    return this.genericRealmFunction$<Tweety, Array<DBClientType<Tweety>>>({
      collection: 'tweet',
      executeFn: 'aggregate',
      filterOrAggregate: agg,
    }).pipe(
      map((tweets) => tweets.map((tweet) => dbClientTweetAdapter(tweet)))
    );
  }

  getTweetsForProfile(profileId: string): Observable<Array<Tweety>> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['getTweetsForProfile']({ profileId }))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        Promise.all([
          db.collection<DBClientType<Profile>>('profile').findOne({
            profileId: new BSON.ObjectId(profileId),
          }),
          db.collection<DBClientType<Tweety>>('tweet').find(
            {
              profileId: new BSON.ObjectId(profileId),
            },
            {
              sort: {
                'timestamp.createdAt': -1,
              },
            }
          ),
        ])
      ),
      map(([profileDb, tweetsDb]): [Profile | null, Array<Tweety>] => [
        profileDb ? dbClientProfileAdapter(profileDb) : null,
        tweetsDb.map((tweetDb) => dbClientTweetAdapter(tweetDb)),
      ]),
      map(([profile, tweets]) =>
        profile
          ? tweets.map((tweet) => ({
              ...tweet,
              denormalization: {
                profile,
              },
            }))
          : tweets
      )
    );
  }

  get(tweetId: Tweety['id'], profileId: Profile['id']): Observable<Tweety> {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Tweety>>('tweet').findOne({
          _id: new BSON.ObjectId(tweetId),
          profileId: new BSON.ObjectId(profileId),
        })
      ),
      filter(Boolean),
      map((dbTweet) => dbClientTweetAdapter(dbTweet))
    );
  }

  getMany(
    ids: Array<{ tweetId: Tweety['id']; profileId: Profile['id'] }>
  ): Observable<Array<Tweety>> {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Tweety>>('tweet').find(
          {
            $or: ids.map(({ tweetId, profileId }) => ({
              _id: clientDBIdAdapter(tweetId),
              profileId: clientDBIdAdapter(profileId),
            })),
          },
          {
            sort: {
              'timestamp.createdAt': -1,
            },
          }
        )
      ),
      take(1),
      map((dbTweets) => dbTweets.map(dbClientTweetAdapter))
    );
  }

  newTweet(tweet: Partial<Tweety>): Observable<Tweety> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['postTweet'](tweet))
    // );

    const now = new Date();

    const newTweet = {
      ...tweet,
      profileId: new BSON.ObjectId(tweet.profileId),
      timestamp: {
        // @TODO @FIXME Check if this has to be stored as date or as MongoDB Object
        createdAt: now,
      },
    };

    return this.db$().pipe(
      switchMap((db) => db.collection('tweet').insertOne(newTweet)),
      map(({ insertedId }) =>
        dbClientTweetAdapter({ ...newTweet, _id: insertedId } as any)
      )
    );
  }

  deleteTweet(tweet: Tweety): Observable<boolean> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['deleteTweets'](ids))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        combineLatest([
          db.collection('tweet').deleteOne({
            _id: new BSON.ObjectId(tweet.id),
          }),
          // TODO maybe in a future we would have different logic
          this.#deleteAllTweetBookmarks(tweet.id),
          this.#deleteAllRetweet(tweet.id),
        ])
      ),
      map(([{ deletedCount }]) => deletedCount > 0)
    );
  }

  deleteRetweet(retweet: Tweety): Observable<boolean> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['deleteTweets'](ids))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        db.collection('retweet').deleteOne({
          _id: new BSON.ObjectId(retweet.id),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  #deleteAllRetweet(tweetId: string): Observable<boolean> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['deleteTweets'](ids))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        db.collection('retweet').deleteMany({
          tweetId: new BSON.ObjectId(tweetId),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  likeTweet(tweet: Tweety) {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['putTweet'](tweet))
    // );
    return this.#updateTweet(tweet);
  }

  deleteComment(
    tweet: Tweety,
    { profileId, content, createdAt }: TweetComment
  ) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection('tweet').updateOne(
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
      ),
      map(() => null)
    );
  }

  commentTweet(tweet: Partial<Tweety>) {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['putTweet'](tweet))
    // );
    return this.#updateTweet(tweet);
  }

  getBookmarks(profileId: Profile['id']): Observable<Array<Bookmark>> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['getBookmarks'](profileId))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        db.collection('bookmark').find(
          {
            profileIdBookmarker: new BSON.ObjectId(profileId),
          },
          {
            sort: {
              'timestamp.createdAt': -1,
            },
          }
        )
      ),
      map((bookmarks) => bookmarks.map(dbClientBookmarkAdapter))
    );
  }

  bookmark(bookmark: Partial<Bookmark>): Observable<Bookmark> {
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['postBookmark'](bookmark))
    // );

    const dbBookmark = {
      ...bookmark,
      tweetId: new BSON.ObjectId(bookmark.tweetId),
      profileIdTweetyOwner: new BSON.ObjectId(bookmark.profileIdTweetyOwner),
      profileIdBookmarker: new BSON.ObjectId(bookmark.profileIdBookmarker),
      timestamp: {
        createdAt: new Date(Date.now()),
      },
    } as any;

    return this.db$().pipe(
      switchMap((db) => db.collection('bookmark').insertOne(dbBookmark)),
      map(({ insertedId }) =>
        dbClientBookmarkAdapter({
          ...dbBookmark,
          _id: insertedId,
        })
      )
    );
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
    // return this.realmFunctions$().pipe(
    //   switchMap((fn) => fn['deleteBookmark'](bookmark))
    // );

    return this.db$().pipe(
      switchMap((db) =>
        db.collection('bookmark').deleteOne({
          tweetId: new BSON.ObjectId(tweetId),
          profileIdBookmarker: new BSON.ObjectId(profileIdBookmarker),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  #deleteAllTweetBookmarks(tweetId: Tweety['id']): Observable<boolean> {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection('bookmark').deleteMany({
          tweetId: new BSON.ObjectId(tweetId),
        })
      ),
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  retweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection('retweet').insertOne({
          tweetId: new BSON.ObjectId(tweetId),
          profileId: new BSON.ObjectId(profileId),
          timestamp: {
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
          },
        })
      ),
      map(({ insertedId }) => insertedId.toString())
    );
  }

  #updateTweet({
    id,
    profileId,
    type,
    timestamp,
    ...tweetRest
  }: Partial<Tweety>) {
    return this.db$().pipe(
      switchMap((db) => {
        const collection =
          type === TweetyType.Retweet
            ? db.collection<DBClientType<Tweety>>('retweet')
            : db.collection<DBClientType<Tweety>>('tweet');

        return collection.findOneAndUpdate(
          {
            _id: new BSON.ObjectId(id),
          },
          {
            $set: tweetRest,
            $currentDate: {
              'timestamp.updatedAt': true,
            },
          },
          {
            returnNewDocument: true,
          }
        );
      }),
      map((dbTweet) => (dbTweet ? dbClientTweetAdapter(dbTweet) : dbTweet))
    );
  }
}
