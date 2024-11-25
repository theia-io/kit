import { inject, Injectable } from '@angular/core';
import {
  FeatKudoBoardCommentActions,
  FeatKudoBoardReactionActions,
} from '@kitouch/data-kudoboard';
import {
  FeatFarewellActions,
  FeatFarewellCommentActions,
  FeatFarewellReactionActions,
} from '@kitouch/feat-farewell-data';
import { FeatFollowActions } from '@kitouch/feat-follow-data';
import {
  FeatProfileActions,
  FeatProfileApiActions,
  noopAction,
  selectProfileById,
} from '@kitouch/kit-data';
import { KitTimestamp, Profile } from '@kitouch/shared-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { ProfileService } from './profile.service';
import { TweetApiActions } from '@kitouch/feat-tweet-data';
import { select, Store } from '@ngrx/store';

@Injectable()
export class ProfileEffects {
  #store = inject(Store);
  #actions$ = inject(Actions);
  #profileService = inject(ProfileService);

  profilesFollowing$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getProfiles),
      switchMap(({ profileIds }) =>
        this.#profileService.getProfiles(profileIds).pipe(
          map((profiles) =>
            FeatProfileApiActions.getProfilesSuccess({ profiles })
          ),
          catchError((err) => {
            console.error('[ProfileEffects] profilesFollowing', err);
            return of(FeatProfileApiActions.getProfilesFailure());
          })
        )
      )
    )
  );

  // ensure profiles are resolved through the app
  tweetProfileExist$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(TweetApiActions.get),
      switchMap(({ profileId }) =>
        this.#store.pipe(
          select(selectProfileById(profileId)),
          take(1),
          map((profile) =>
            profile
              ? noopAction()
              : FeatProfileApiActions.getProfiles({ profileIds: [profileId] })
          )
        )
      )
    )
  );

  // enriching profiles from different responses through the app
  enrichProfilesFromSuggestions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFollowActions.getSuggestionColleaguesToFollowSuccess),
      map(({ profiles }) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewellReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellReactionActions.getReactionsFarewellSuccess),
      map(({ reactions }) => getRecentUniqueProfilesFromT(reactions)),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewellSuccess),
      map(({ farewell }) => getRecentUniqueProfilesFromT([farewell])),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromKudoBoardReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardReactionActions.getReactionsKudoBoardSuccess),
      map(({ reactions }) => getRecentUniqueProfilesFromT(reactions)),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewellComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.getCommentsFarewellSuccess),
      map(({ comments }) => getRecentUniqueProfilesFromT(comments)),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromKudoBoardComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.getCommentsKudoBoardSuccess),
      map(({ comments }) => getRecentUniqueProfilesFromT(comments)),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  // CRUD
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

// TODO test this
const getRecentUniqueProfilesFromT = <
  T extends { profile?: Profile; timestamp: KitTimestamp }
>(
  items: Array<T>
): Array<Profile> => {
  const profilesMap = new Map<Profile['id'], T & { profile: Profile }>();

  items.forEach((item) => {
    const { profile, timestamp } = item;
    if (!profile) {
      return;
    }

    const { id } = profile;
    const savedProfile = profilesMap.get(id);
    if (!savedProfile) {
      profilesMap.set(id, { ...item, profile });
      return;
    }

    // get latest profile (= latest farewell reaction)
    if (
      savedProfile.timestamp.createdAt.getTime() -
        timestamp.createdAt.getTime() <
      0
    ) {
      profilesMap.set(id, { ...item, profile });
      return;
    }
  });

  return [...profilesMap.values()].map(({ profile }) => profile);
};
