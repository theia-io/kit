import { Injectable, inject } from '@angular/core';
import {
  dbClientUserAdapter,
  getExperienceEqualityObject,
  selectCurrentUser,
} from '@kitouch/kit-data';
import { DataSourceService } from '@kitouch/shared-infra';
import { Experience, User } from '@kitouch/shared-models';
import { DBClientType } from '@kitouch/utils';
import { Store } from '@ngrx/store';
import { BSON } from 'realm-web';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DataSourceService {
  currentUser$ = inject(Store).select(selectCurrentUser).pipe(filter(Boolean));

  addUserExperience$(experience: Experience) {
    return this.currentUser$.pipe(
      take(1),
      switchMap((user) =>
        // realmFunctions['genericRealmFunction']
        this.genericRealmFunction$({
          collection: 'user',
          executeFn: 'updateOne',
          filterOrAggregate: { _id: new BSON.ObjectId(user.id) },
          query: [
            {
              $set: {
                experiences: {
                  $cond: [
                    { $not: [{ $isArray: '$experiences' }] }, // Check if experiences is not an array
                    [experience],
                    {
                      $cond: [
                        { $eq: [{ $size: '$experiences' }, 0] }, // Check if experiences is an empty array
                        [experience],
                        { $concatArrays: ['$experiences', [experience]] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        })
      ),
      map(() => true)
    );
  }

  deleteUserExperience$(experience: Experience) {
    return this.db$().pipe(
      withLatestFrom(this.currentUser$),
      switchMap(([db, user]) =>
        db.collection('user').updateOne(
          {
            _id: new BSON.ObjectId(user.id),
            experiences: {
              $elemMatch: getExperienceEqualityObject(experience),
            },
          },
          {
            $pull: { experiences: getExperienceEqualityObject(experience) },
          }
        )
      ),
      map(() => ({ experience }))
    );
  }

  getUser$(userId: string) {
    return this.db$().pipe(
      switchMap((db) =>
        db.collection<DBClientType<User>>('user').findOne({
          _id: new BSON.ObjectId(userId),
        })
      ),
      map((user) => (user ? dbClientUserAdapter(user) : null))
    );
  }
}
