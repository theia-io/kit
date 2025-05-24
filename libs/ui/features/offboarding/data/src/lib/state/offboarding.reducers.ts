import {
  ExpOffboarding,
  ExpOffboardingAnalytics,
} from '@kitouch/shared-models';
import { addOrUpdate, mergeArr, remove } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatExpOffboardingAnalyticsActions } from '../actions/offboarding-analytics.actions';
import { FeatExpOffboardingActions } from '../actions/offboarding.actions';

export interface FeatureExpOffboardingState {
  offboardings: Array<ExpOffboarding>;
  analytics: Array<ExpOffboardingAnalytics>;
}

const featExpOffboardingInitialState: FeatureExpOffboardingState = {
  offboardings: [],
  analytics: [],
};

export const featExpOffboardingReducer = createReducer(
  featExpOffboardingInitialState,
  on(
    FeatExpOffboardingActions.getExpOffboardingsSuccess,
    (state, { offboardings }) => ({
      ...state,
      offboardings: mergeArr(offboardings, state.offboardings),
    })
  ),
  on(
    FeatExpOffboardingActions.putExpOffboardingSuccess,
    FeatExpOffboardingActions.getExpOffboardingSuccess,
    FeatExpOffboardingActions.createExpOffboardingSuccess,
    (state, { offboarding }) => ({
      ...state,
      offboardings: addOrUpdate(offboarding, state.offboardings),
    })
  ),
  on(
    FeatExpOffboardingActions.deleteExpOffboardingSuccess,
    (state, { id }) => ({
      ...state,
      offboardings: remove(id, state.offboardings),
    })
  ),
  /** Analytics */
  on(
    FeatExpOffboardingAnalyticsActions.getAllAnalyticsSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: mergeArr(analytics, state.analytics),
    })
  ),
  on(
    FeatExpOffboardingAnalyticsActions.getAnalyticsExpOffboardingSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: mergeArr(state.analytics, analytics),
    })
  ),
  on(
    FeatExpOffboardingAnalyticsActions.postAnalyticsExpOffboardingSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: addOrUpdate(analytics, state.analytics),
    })
  ),
  on(
    FeatExpOffboardingAnalyticsActions.deleteAnalyticsExpOffboardingSuccess,
    (state, { id }) => ({
      ...state,
      analytics: remove(id, state.analytics),
    })
  )
);
