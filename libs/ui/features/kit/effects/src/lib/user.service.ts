import { Injectable, inject } from '@angular/core';
import { selectUser } from '@kitouch/features/kit/data';
import { Experience, User } from '@kitouch/shared/models';
import { DataSourceService } from '@kitouch/ui/shared';
import { Store } from '@ngrx/store';
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
        db.collection<User>('user').updateOne(
          { _id: user.id },
          {
            $set: {
              experiences: {
                $cond: [
                  // Conditional update
                  { $ifNull: ['$experiences', false] },
                  { $concatArrays: ['$experiences', [experience]] },
                  [experience],
                ],
              },
            },
          }
        )
      ),
      map(() => ({experiences:[experience]}))
    );
  }
}
