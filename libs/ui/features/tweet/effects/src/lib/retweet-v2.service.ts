import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Profile, ReTweety, Tweety } from '@kitouch/shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReTweetV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  retweet(tweetId: Tweety['id'], profileId: Profile['id']) {
    return this.#http.post<ReTweety>(`${this.#environment.api.retweets}`, {
      tweetId: tweetId,
      retweetedProfileId: profileId,
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
}
