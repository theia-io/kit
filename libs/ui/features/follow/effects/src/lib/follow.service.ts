import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Profile, User } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { DBClientType } from '@kitouch/utils';
import { Observable } from 'rxjs';
import { dbClientProfileAdapter } from '@kitouch/kit-data';

@Injectable({ providedIn: 'root' })
export class FollowService extends DataSourceService {
  getColleaguesProfileSuggestions$(user: User): Observable<Array<Profile>> {
    return this.realmFunction$<Array<DBClientType<Profile>>>(
      'getSuggestionColleaguesToFollow',
      user
    ).pipe(map((profiles) => profiles.map(dbClientProfileAdapter)));
  }
}
