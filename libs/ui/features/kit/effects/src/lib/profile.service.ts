import { Injectable } from '@angular/core';
import { Profile } from '@kitouch/shared-models';
import { DataSourceService } from '@kitouch/ui/shared';
import { BSON } from 'realm-web';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends DataSourceService {
  getProfiles(profiles: Array<Profile['id']>): Observable<Array<Profile>> {
    return this.realmFunctions$().pipe(
      switchMap((fns) => fns['getProfiles'](profiles))
    );
  }

  put(profile: Partial<Profile>) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<Profile>('profile').updateOne(
          { _id: new BSON.ObjectId(profile.id) },
          {
            $set: {
              ...profile,
            },
          }
        )
      ),
      map(() => profile)
      /** @TODO @FIXME places like this must have error handlings */
    );
  }
}
