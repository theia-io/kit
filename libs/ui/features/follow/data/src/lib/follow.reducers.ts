import { Profile } from '@kitouch/shared/models';
import { mergeArr } from '@kitouch/ui/shared';
import { createReducer, on } from '@ngrx/store';
import { FeatFollowActions } from './follow.actions';

export interface FeatureFollowState {
  colleagues: Array<Profile>;
}

const featFollowInitialState: FeatureFollowState = {
  colleagues: [],
};

export const featFollowReducer = createReducer(
  featFollowInitialState,
  on(
    FeatFollowActions.getSuggestionColleaguesToFollowSuccess,
    (state, { profiles }) => ({
      ...state,
      colleagues: mergeArr(state.colleagues, profiles),
    })
  )
);
