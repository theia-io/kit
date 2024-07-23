import { Injectable, inject } from '@angular/core';
import {
  getExperienceEqualityObject,
  selectUser,
} from '@kitouch/features/kit/data';
import { Experience } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
import { BSON } from 'realm-web';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DataSourceService {
  user$ = inject(Store).select(selectUser).pipe(filter(Boolean));

  addUserExperience$(experience: Experience) {
    return this.realmFunctions$.pipe(
      withLatestFrom(this.user$),
      switchMap(([realmFunctions, user]) =>
        realmFunctions['genericRealmFunction']({
          collection: 'user',
          executeFn: 'updateOne',
          filter: { _id: new BSON.ObjectId(user.id) },
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
      map(() => ({ experiences: [experience] }))
    );
  }

  deleteUserExperience$(experience: Experience) {
    return this.db$.pipe(
      withLatestFrom(this.user$),
      switchMap(([db, user]) =>
        db.collection('user').deleteOne({
          _id: new BSON.ObjectId(user.id),
          experiences: {
            $elemMatch: getExperienceEqualityObject(experience)
          }
        })
      ),
      map(() => ({ experience }))
    );
  }
}
