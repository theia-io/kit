import { Profile } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatProfileApiActions } from './profile.actions';
import { addOrUpdate } from '@kitouch/ui-shared';
// import { mongooseEqual } from '@kitouch/shared-utils';

export interface FeatureProfileState {
  currentProfile?: Profile;
  profiles?: Array<Profile>;
  allSystemProfiles: Map<Profile['id'], Profile>;
}

const featProfileInitialState: FeatureProfileState = {
  currentProfile: undefined,
  profiles: undefined,
  allSystemProfiles: new Map(),
};

const combineProfiles = (
  profileArr1: Array<Profile>,
  profileArr2: Array<Profile>
): Array<Profile> => {
  const combinedProfiles = new Map<string, Profile>();

  profileArr1.forEach((profile) => {
    combinedProfiles.set(profile.id, profile);
  });

  // has to be after "current" state since might have better info
  profileArr2.forEach((profile) => {
    combinedProfiles.set(profile.id, profile);
  });

  return [...combinedProfiles.values()];
};

export const profileReducer = createReducer(
  featProfileInitialState,
  on(FeatProfileApiActions.setCurrentProfile, (state, { profile }) => ({
    ...state,
    currentProfile: profile,
  })),
  on(FeatProfileApiActions.setProfiles, (state, { profiles }) => ({
    ...state,
    profiles: combineProfiles(state.profiles || [], profiles),
  })),
  on(
    FeatProfileApiActions.getFollowingProfilesSuccess,
    (state, { profiles }) => ({
      ...state,
      profiles: combineProfiles(state.profiles || [], profiles),
    })
  ),
  on(FeatProfileApiActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    currentProfile: { ...state.currentProfile, ...profile },
    profiles: addOrUpdate(profile, state.profiles ?? []),
  }))
);
