import { Profile } from '@kitouch/shared-models';
import { mergeArr } from '@kitouch/ui-shared';
import { createReducer, on } from '@ngrx/store';
import { FeatFollowActions } from './follow.actions';

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
