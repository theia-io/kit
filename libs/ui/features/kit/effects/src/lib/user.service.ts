import { Injectable, inject } from '@angular/core';
import { selectUser } from '@kitouch/features/kit/data';
import { Experience, User } from '@kitouch/shared/models';
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
    return this.db$.pipe(
      withLatestFrom(this.user$),
      switchMap(([db, user]) =>
        // @TODO aggregate does not insert data :/// 
        db.collection<User>('user').aggregate([
          { $match: { _id: new BSON.ObjectId(user.id) } },
          {
            $set: {
                experiences: {
                  $cond: [
                    {
                      $or: [
                        { $ifNull: ["$experiences", true] }, // Check if $experience is null or missing
                        { $eq: ["$experiences", []] } // Check if $experience is an empty array
                      ]
                    },
                    [experience], // If experience is null or empty, keep the existing experiences
                    {
                      $concatArrays: [
                        ["$experiences"],
                        [experience]
                      ]
                    } // Otherwise, concatenate
                  ]
                }
              }
          },
          {
            $project: {
                _id: 0,
                experiences: 1,
              }
          }
        ])
      ),
    );
  }
}
