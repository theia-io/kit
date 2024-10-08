import { Injectable, inject } from '@angular/core';
import { FeatProfileApiActions } from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProfileService } from './profile.service';
import { FeatFollowActions } from '@kitouch/feat-follow-data';

@Injectable()
export class ProfileEffects {
  #actions$ = inject(Actions);
  #profileService = inject(ProfileService);

  profilesFollowing$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getFollowingProfiles),
      switchMap(({ profileIds }) =>
        this.#profileService.getProfiles(profileIds).pipe(
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

  enrichProfilesFromSuggestions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFollowActions.getSuggestionColleaguesToFollowSuccess),
      map(({ profiles }) =>
        FeatProfileApiActions.getFollowingProfilesSuccess({ profiles })
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.updateProfile),
      switchMap(({ profile }) =>
        this.#profileService.put(profile).pipe(
          map(() => FeatProfileApiActions.updateProfileSuccess({ profile })),
          catchError((err) => {
            console.error('[ProfileEffects] updateProfile', err);
            return of(
              FeatProfileApiActions.updateProfileFailure({
                message: 'Error while updating your profile',
              })
            );
          })
        )
      )
    )
  );
}
