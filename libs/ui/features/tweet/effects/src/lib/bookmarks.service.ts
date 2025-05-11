import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Bookmark, Profile, Tweety } from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getBookmarks(profileId: Profile['id']) {
    return this.#http.get<Array<Bookmark>>(
      `${this.#environment.api.bookmarks}`,
      {
        params: {
          profileId: profileId,
        },
      },
    );
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

    return this.#http.post<Bookmark>(
      `${this.#environment.api.bookmarks}`,
      bookmark,
    );
  }

  deleteBookmark(id: Bookmark['id']): Observable<boolean> {
    return this.#http.delete<boolean>(
      `${this.#environment.api.bookmarks}/${id}`,
    );
  }

  deleteTweetBookmark(
    tweetId: Tweety['id'],
    profileIdBookmarker: Profile['id'],
  ): Observable<boolean> {
    return this.#http.delete<boolean>(`${this.#environment.api.bookmarks}`, {
      params: {
        tweetId,
        profileIdBookmarker,
      },
    });
  }

  deleteAllTweetBookmarks(tweetId: Tweety['id']): Observable<boolean> {
    return this.#http.delete<boolean>(
      `${this.#environment.api.bookmarks}/all/${tweetId}`,
    );
  }
}
