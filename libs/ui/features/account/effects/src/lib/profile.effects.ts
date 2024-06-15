import { Injectable, inject } from '@angular/core';
import {
    FeatProfileApiActions
} from '@kitouch/features/account/data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  #profileService = inject(ProfileService);

  profilesFollowing$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getFollowingProfiles),
      switchMap(({ profileIds }) =>
        this.#profileService.getFollowingProfiles(profileIds).pipe(
          map((profiles) =>
            FeatProfileApiActions.getFollowingProfilesSuccess({ profiles })
          ),
          catchError((err) => {
            console.error('[ProfileEffects] profilesFollowing', err);
            return of(FeatProfileApiActions.getFollowingProfilesFailure());
          })
        )
      )
    )
  );
}
