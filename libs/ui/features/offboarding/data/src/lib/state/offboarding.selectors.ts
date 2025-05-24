import {
  ExpOffboarding,
  ExpOffboardingAnalytics,
} from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureExpOffboardingState } from './offboarding.reducers';

/** selectors */
const selectExpOffboardingState = (state: {
  offboarding: FeatureExpOffboardingState;
}) => state.offboarding;

export const selectExpOffboardings = createSelector(
  selectExpOffboardingState,
  (state) => state.offboardings
);

export const selectAnalytics = createSelector(
  selectExpOffboardingState,
  (state) => state.analytics
);

export const selectExpOffboardingById = (offboardingId: ExpOffboarding['id']) =>
  createSelector(selectExpOffboardings, (kudoBoards) =>
    findExpOffboardingById(offboardingId, kudoBoards)
  );

export const selectExpOffboardingAnalyticsById = (
  offboardingId: ExpOffboarding['id']
) =>
  createSelector(selectAnalytics, (analytics) =>
    findAnalyticsExpOffboardingById(offboardingId, analytics)
  );

/** utils */
export const findExpOffboardingById = (
  offboardingId: ExpOffboarding['id'],
  offboardings: Array<ExpOffboarding>
) => offboardings.find((offboarding) => offboarding.id === offboardingId);

export const findAnalyticsExpOffboardingById = (
  offboardingId: ExpOffboarding['id'],
  analytics: Array<ExpOffboardingAnalytics>
) => analytics.filter((analytic) => analytic.offboardingId === offboardingId);
