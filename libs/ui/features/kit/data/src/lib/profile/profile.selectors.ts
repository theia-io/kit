import { Profile } from '@kitouch/shared/models';
import { createSelector } from '@ngrx/store';
import { FeatureProfileState } from './profile.reducers';

/**
 * Utilities
 */
export const profilePicture = (profile: Partial<Profile>) =>
  profile.pictures?.find((pic) => pic.isPrimary)?.url ??
  profile.pictures?.[0]?.url ??
  '/public/john-dou.png';

/**
 * Selectors
 */
const selectProfileState = (state: { kit: { profile: FeatureProfileState } }) =>
  state.kit?.profile;

/** Profiles */
export const selectCurrentProfile = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.currentProfile
);

export const selectProfilePicture = createSelector(
  selectCurrentProfile,
  (currentProfile) => profilePicture(currentProfile ?? {})
);

export const selectProfiles = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.profiles ?? []
);

/** Utilities */

export const selectProfile = (profileId: string) =>
  createSelector(selectProfiles, (profiles: Profile[]) =>
    profiles.find(({ id }) => id === profileId)
  );

export const selectProfileFollowingOrNot = (profiles: Array<Profile>) =>
  createSelector(selectCurrentProfile, (currentProfile) => {
    const currentProfileFollowingSet = new Set(
      currentProfile?.following?.map(({ id }) => id)
    );

    const followingProfiles: Map<Profile['id'], Profile> = new Map(),
      notFollowingProfiles: Map<Profile['id'], Profile> = new Map;

    profiles.forEach((profile) => {
      if (currentProfileFollowingSet.has(profile.id)) {
        followingProfiles.set(profile.id, profile);
      } else {
        notFollowingProfiles.set(profile.id, profile);
      }
    }, {});

    return [followingProfiles, notFollowingProfiles];
  });
