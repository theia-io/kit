import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '@kitouch/ui/shared';
import { of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  getAll() {
    return this.auth.loggedInUser$.pipe(
      take(1),
      switchMap((user) => user.functions['allTweets']()),
      tap(v => console.log('[TweetApiService] getAll', v))
    );
  }
}
