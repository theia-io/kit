import { Injectable } from '@angular/core';
import { Profile, User } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui-shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FollowService extends DataSourceService {
  getColleaguesProfileSuggestions$(user: User): Observable<Array<Profile>> {
    return this.realmFunction$('getSuggestionColleaguesToFollow', user);
  }
}
