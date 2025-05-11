import { Profile } from '@kitouch/shared-models';
import { addOrUpdate, mergeArr } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatProfileActions, FeatProfileApiActions } from './profile.actions';
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

export const profileReducer = createReducer(
  featProfileInitialState,
  on(FeatProfileApiActions.setCurrentProfile, (state, { profile }) => ({
    ...state,
    currentProfile: profile,
  })),
  on(
    FeatProfileActions.addProfiles,
    FeatProfileApiActions.setProfiles,
    FeatProfileApiActions.getProfilesSuccess,
    (state, { profiles }) => ({
      ...state,
      profiles: mergeArr(state.profiles || [], profiles),
    }),
  ),
  on(FeatProfileActions.addProfilesSoftly, (state, { profiles }) => ({
    ...state,
    profiles: mergeArr(profiles, state.profiles || []),
  })),
  on(FeatProfileApiActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    currentProfile: { ...state.currentProfile, ...profile },
    profiles: addOrUpdate(profile, state.profiles ?? []),
  })),
);
