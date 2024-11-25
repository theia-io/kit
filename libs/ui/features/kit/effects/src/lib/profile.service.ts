import { inject, Injectable } from '@angular/core';
import {
  clientDBProfileAdapter,
  dbClientProfileAdapter,
} from '@kitouch/kit-data';
import { DataSourceService, ENVIRONMENT } from '@kitouch/shared-infra';
import { Profile } from '@kitouch/shared-models';
import { DBClientType } from '@kitouch/utils';
import { BSON } from 'realm-web';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends DataSourceService {
  #env = inject(ENVIRONMENT);

  getProfiles(profiles: Array<Profile['id']>): Observable<Array<Profile>> {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection('profile').find({
          _id: {
            $in: profiles.map((id) => new BSON.ObjectId(id)),
          },
        })
      ),
      map((profiles) => profiles.map(dbClientProfileAdapter))
    );
  }

  put(profile: Profile): Observable<null> {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<Profile>>('profile').updateOne(
          { _id: new BSON.ObjectId(profile.id) },
          {
            $set: {
              ...clientDBProfileAdapter(profile),
            },
          }
        )
      ),
      map(() => null)
      /** @TODO @FIXME places like this must have error handlings */
    );
  }

  uploadProfilePicture(key: string, media: Blob) {
    return this.setBucketItem(this.#env.s3Config.profileBucket, key, media);
  }
}
