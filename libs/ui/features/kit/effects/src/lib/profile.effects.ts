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
  FeatBookmarksActions,
  TweetApiActions,
} from '@kitouch/feat-tweet-data';
import {
  FeatProfileActions,
  FeatProfileApiActions,
  selectProfilesByIds,
} from '@kitouch/kit-data';
import { KitTimestamp, Profile, TweetComment } from '@kitouch/shared-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  bufferTime,
  catchError,
  filter,
  map,
  merge,
  of,
  switchMap,
  take,
} from 'rxjs';
import { ProfileV2Service } from './profilev2.service';
import { getFullS3Url, getImageKeyFromS3Url } from '@kitouch/shared-services';
import { S3_PROFILE_BUCKET_BASE_URL } from '@kitouch/shared-infra';

@Injectable()
export class ProfileEffects {
  #store = inject(Store);
  #actions$ = inject(Actions);
  #profileV2Service = inject(ProfileV2Service);
  #s3ProfileBaseUrl = inject(S3_PROFILE_BUCKET_BASE_URL);

  /** PROFILES API */
  profiles$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getProfiles),
      map(({ profileIds }) => profileIds.filter((id) => !!id)),
      filter((profileIds) => !!profileIds.length),
      switchMap((profileIds) =>
        this.#profileV2Service.getProfiles(profileIds).pipe(
          map((profiles) =>
            FeatProfileApiActions.getProfilesSuccess({ profiles })
          ),
          catchError((err) => {
            console.error('[ProfileEffects] profiles$', err);
            return of(FeatProfileApiActions.getProfilesFailure());
          })
        )
      )
    )
  );

  profileFollowers$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getProfileFollowers),
      switchMap(({ profileId }) =>
        this.#profileV2Service.getProfileFollowers(profileId).pipe(
          map((profiles) =>
            FeatProfileApiActions.getProfileFollowersSuccess({ profiles })
          ),
          catchError((err) => {
            console.error('[ProfileEffects] profileFollowers$', err);
            return of(FeatProfileApiActions.getProfileFollowersFailure());
          })
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.updateProfile),
      switchMap(({ profile }) =>
        this.#profileV2Service.put(profile).pipe(
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
        this.#profileV2Service.uploadProfilePicture(id, pic).pipe(
          map((media) => ({
            ...media,
            url: getFullS3Url(this.#s3ProfileBaseUrl, media.url),
            optimizedUrls: media.optimizedUrls.map((optimizedUrl) =>
              getFullS3Url(this.#s3ProfileBaseUrl, optimizedUrl)
            ),
          })),
          map((media) =>
            FeatProfileApiActions.uploadProfilePictureSuccess({ id, media })
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
        this.#profileV2Service.uploadProfilePicture(id, pic).pipe(
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

  /**
   * ENRICH APIs
   * Update localstore (NgRx) in memory data.
   *
   * Usually come from outside.
   *
   **/

  #profilesForTweets$ = this.#actions$.pipe(
    ofType(TweetApiActions.getAllSuccess),
    map(({ tweets }) => tweets.map(({ profileId }) => profileId))
  );

  #profilesForTweet$ = this.#actions$.pipe(
    ofType(TweetApiActions.get),
    map(({ profileId }) => profileId)
  );

  #profilesForTweetComments$ = this.#actions$.pipe(
    ofType(TweetApiActions.getSuccess),
    map(({ tweet: { comments } }) => comments),
    filter((comments): comments is Array<TweetComment> => !!comments?.length),
    map((comments) =>
      comments.map((comment) => comment?.profileId ?? '').filter(Boolean)
    )
  );

  #profilesForProfileTweets$ = this.#actions$.pipe(
    ofType(TweetApiActions.getTweetsForProfileSuccess),
    map(({ tweets }) => tweets.map(({ profileId }) => profileId))
  );

  #profilesForBookmarks$ = this.#actions$.pipe(
    ofType(FeatBookmarksActions.getBookmarksFeed),
    map(({ bookmarks }) =>
      bookmarks.map(({ profileIdTweetyOwner }) => profileIdTweetyOwner)
    )
  );

  // ensure profiles are resolved through the app for tweet
  resolveProfiles$ = createEffect(() =>
    merge(
      this.#profilesForBookmarks$,
      this.#profilesForTweet$,
      this.#profilesForTweetComments$,
      this.#profilesForTweets$,
      this.#profilesForProfileTweets$
    ).pipe(
      bufferTime(1000),
      map((profileIds) => [...new Set(profileIds.flat())]),
      filter((profileIds) => profileIds.length > 0),
      switchMap((uniqueProfileIds) =>
        this.#getUnresolvedProfileIds(uniqueProfileIds)
      ),
      filter((uniqueProfileIds) => uniqueProfileIds.length > 0),
      map((profileIds) => FeatProfileApiActions.getProfiles({ profileIds }))
    )
  );

  enrichProfilesFromFollowers$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatProfileApiActions.getProfileFollowersSuccess),
      filter(({ profiles }) => profiles.length > 0),
      map(({ profiles }) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromSuggestions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFollowActions.getSuggestionColleaguesToFollowSuccess),
      filter(({ profiles }) => profiles.length > 0),
      map(({ profiles }) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewellReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellReactionActions.getReactionsFarewellSuccess),
      map(({ reactions }) => getRecentUniqueProfilesFromT(reactions)),
      filter((profiles) => profiles.length > 0),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewell$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellActions.getFarewellSuccess),
      map(({ farewell }) => getRecentUniqueProfilesFromT([farewell])),
      filter((profiles) => profiles.length > 0),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromKudoBoardReactions$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardReactionActions.getReactionsKudoBoardSuccess),
      map(({ reactions }) => getRecentUniqueProfilesFromT(reactions)),
      filter((profiles) => profiles.length > 0),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromFarewellComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatFarewellCommentActions.getCommentsFarewellSuccess),
      map(({ comments }) => getRecentUniqueProfilesFromT(comments)),
      filter((profiles) => profiles.length > 0),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  enrichProfilesFromKudoBoardComments$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(FeatKudoBoardCommentActions.getCommentsKudoBoardSuccess),
      map(({ comments }) => getRecentUniqueProfilesFromT(comments)),
      filter((profiles) => profiles.length > 0),
      map((profiles) => FeatProfileActions.addProfilesSoftly({ profiles }))
    )
  );

  /** UTILITIES */

  #getUnresolvedProfileIds(profileIds: Array<string>) {
    const uniqueProfileIds = [...new Set(profileIds)];

    return this.#store.pipe(
      select(selectProfilesByIds(uniqueProfileIds)),
      map((resolvedProfiles) => {
        const resolvedProfilesSet = new Set(
          resolvedProfiles.filter((v) => !!v).map(({ id }) => id)
        );
        return uniqueProfileIds.filter(
          (profileId) => !resolvedProfilesSet.has(profileId)
        );
      }),
      take(1)
    );
  }
}

// TODO test this
const getRecentUniqueProfilesFromT = <
  T extends {
    profile?: Profile;
    createdAt?: KitTimestamp['createdAt'];
    timestamp?: Partial<KitTimestamp>;
  }
>(
  items: Array<T>
): Array<Profile> => {
  const profilesMap = new Map<Profile['id'], T & { profile: Profile }>();

  items.forEach((item) => {
    const { profile, timestamp, createdAt } = item;
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new Date(
        savedProfile.createdAt ??
          savedProfile.timestamp?.createdAt ??
          Date.now()
      )!.getTime() -
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new Date(createdAt ?? timestamp?.createdAt ?? Date.now())!.getTime() <
      0
    ) {
      profilesMap.set(id, { ...item, profile });
      return;
    }
  });

  return [...profilesMap.values()].map(({ profile }) => profile);
};
