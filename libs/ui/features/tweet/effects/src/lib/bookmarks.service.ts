import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Bookmark, Profile } from '@kitouch/shared-models';

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
      }
    );
  }
}
