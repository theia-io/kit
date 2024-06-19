import { Profile } from '@kitouch/shared/models';
import { createSelector } from '@ngrx/store';
import { FeatureProfileState } from './profile.reducers';

const selectProfileState = (state: { kit: { profile: FeatureProfileState} }) =>
  state.kit?.profile;

/** Profiles */
export const selectCurrentProfile = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.currentProfile
);

export const selectProfiles = createSelector(
  selectProfileState,
  (state: FeatureProfileState) => state.profiles ?? []
);

export const selectProfile = (profileId: string) =>
  createSelector(selectProfiles, (profiles: Profile[]) =>
    profiles.find(({ id }) => id === profileId)
  );
