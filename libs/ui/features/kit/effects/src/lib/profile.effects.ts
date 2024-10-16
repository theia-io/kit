import { inject, Injectable } from '@angular/core';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import { FeatProfileApiActions } from '@kitouch/kit-data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileEffects {
  #store = inject(Store);
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

  uploadProfilePic$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.uploadProfilePicture),
      switchMap(({ id, pic }) =>
        this.#profileService.uploadProfilePicture(id, pic).pipe(
          map(() =>
            FeatProfileApiActions.uploadProfilePictureSuccess({ id, url: id })
          ),
          catchError((err) => {
            console.error('[ProfileEffects][uploadProfilePic$]', err);
            return of(
              FeatProfileApiActions.uploadProfilePictureFailure({
                message: 'Cannot upload new profile picture',
              })
            );
          })
        )
      )
    )
  );

  uploadProfileBackground$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.uploadProfileBackground),
      switchMap(({ id, pic }) =>
        this.#profileService.uploadProfilePicture(id, pic).pipe(
          map(() =>
            FeatProfileApiActions.uploadProfileBackgroundSuccess({
              id,
              url: id,
            })
          ),
          catchError((err) => {
            console.error('[ProfileEffects][uploadProfileBackground$]', err);
            return of(
              FeatProfileApiActions.uploadProfileBackgroundFailure({
                message: 'Cannot upload new profile picture',
              })
            );
          })
        )
      )
    )
  );
}
