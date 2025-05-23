import { Profile } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureProfileState } from './profile.reducers';

/**
 * Utilities
 */
export const profilePicture = (profile: Partial<Profile> | undefined | null) =>
  profile?.pictures?.[0]?.optimizedUrls?.[0] ??
  profile?.pictures?.[0]?.url ??
  '/john-dou.png';

export const profilePictureDimensions = (
  profile: Partial<Profile> | undefined | null
) => ({
  height: profile?.pictures?.[0]?.height,
  width: profile?.pictures?.[0]?.width,
});

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

export const selectCurrentProfileFollowing = createSelector(
  selectCurrentProfile,
  (currentProfile: Profile | undefined) => currentProfile?.following ?? []
);

export const selectFollowingProfiles = (profile: Profile) => {
  const followingIds = new Set(profile.following?.map(({ id }) => id) ?? []);
  return createSelector(selectProfiles, (profiles: Profile[]) => {
    return profiles.filter((profile) => followingIds.has(profile.id));
  });
};

export const selectProfileFollowers = (profileId: Profile['id']) =>
  createSelector(selectProfiles, (profiles: Profile[]) => {
    return profiles.filter(({ following }) =>
      following?.some(({ id }) => id === profileId)
    );
  });

export const selectProfilePicture = createSelector(
  selectCurrentProfile,
  (currentProfile) => profilePicture(currentProfile ?? {})
);

export const selectProfiles = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.profiles ?? []
);

/** Utilities */
export const selectProfileById = (profileId: string) =>
  createSelector(selectProfiles, (profiles: Profile[]) => {
    return (
      profiles.find(({ id }) => id === profileId) ??
      profiles.find(({ alias }) => alias === profileId)
    );
  });

export const selectProfilesByIds = (profileIds: Array<Profile['id']>) =>
  createSelector(selectProfiles, (profiles) => {
    const profilesMap = new Map(
      profiles.map((profile) => [profile.id, profile])
    );

    return profileIds.map((profileId) => profilesMap.get(profileId));
  });

/** 2N Get following and not following (but suggest) profiles
 * @returns [SuggestedFollowingMap, SuggestedNotFollowingMap]
 *   */
export const selectFollowingAndNotProfilesMap = (profiles: Array<Profile>) =>
  createSelector(selectCurrentProfile, (currentProfile) => {
    const currentProfileFollowingSet = new Set(
      currentProfile?.following?.map(({ id }) => id)
    );

    const followingProfiles: Map<Profile['id'], Profile> = new Map(),
      notFollowingProfiles: Map<Profile['id'], Profile> = new Map();

    profiles.forEach((profile) => {
      if (currentProfileFollowingSet.has(profile.id)) {
        followingProfiles.set(profile.id, profile);
      } else {
        notFollowingProfiles.set(profile.id, profile);
      }
    }, {});

    return [followingProfiles, notFollowingProfiles];
  });
