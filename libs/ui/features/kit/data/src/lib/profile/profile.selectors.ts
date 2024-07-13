import { Profile } from '@kitouch/shared/models';
import { createSelector } from '@ngrx/store';
import { FeatureProfileState } from './profile.reducers';

/**
 * Utilities
 */
export const profilePicture = (profile: Partial<Profile>) => profile.pictures?.find(pic => pic.isPrimary)?.url ?? profile.pictures?.[0]?.url ?? '/public/john-dou.png'

/**
 * Selectors
 */
const selectProfileState = (state: { kit: { profile: FeatureProfileState} }) =>
  state.kit?.profile;

/** Profiles */
export const selectCurrentProfile = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.currentProfile
);

export const selectProfilePicture = createSelector(
  selectCurrentProfile,
  currentProfile => profilePicture(currentProfile ?? {})
)

export const selectProfiles = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.profiles ?? []
);

export const selectProfile = (profileId: string) =>
  createSelector(selectProfiles, (profiles: Profile[]) =>
    profiles.find(({ id }) => id === profileId)
  );

