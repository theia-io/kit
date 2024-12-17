import { Injectable } from '@angular/core';
import { dbClientProfileAdapter } from '@kitouch/kit-data';
import { DataSourceService } from '@kitouch/shared-infra';
import { Profile, User } from '@kitouch/shared-models';
import { DBClientType } from '@kitouch/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FollowService extends DataSourceService {
  getColleaguesProfileSuggestions$(user: User): Observable<Array<Profile>> {
    return this.realmFunction$<Array<DBClientType<Profile>>>(
      'getSuggestionColleaguesToFollow',
      user
    ).pipe(map((profiles) => profiles.map(dbClientProfileAdapter)));
  }
}
