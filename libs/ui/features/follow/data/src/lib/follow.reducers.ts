import { Profile } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatFollowActions } from './follow.actions';
import { mergeArr } from '@kitouch/utils';

export interface FeatureFollowState {
  colleaguesProfiles: Array<Profile>;
}

const featFollowInitialState: FeatureFollowState = {
  colleaguesProfiles: [],
};

export const featFollowReducer = createReducer(
  featFollowInitialState,
  on(
    FeatFollowActions.getSuggestionColleaguesToFollowSuccess,
    (state, { profiles }) => ({
      ...state,
      colleaguesProfiles: mergeArr(state.colleaguesProfiles, profiles),
    })
  )
);
