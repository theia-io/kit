import { Injectable } from '@angular/core';
import { Profile, User } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowService extends DataSourceService {
  getColleaguesProfileSuggestions$(user: User): Observable<Array<Profile>> {
    return this.realmFunctions$().pipe(
      switchMap((realmFunctions) =>
        realmFunctions['getSuggestionColleaguesToFollow'](user)
      )
    );
  }
}
