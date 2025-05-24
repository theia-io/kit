import {
  ExpOffboarding,
  ExpOffboardingAnalytics,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatExpOffboardingAnalyticsActions = createActionGroup({
  source: 'FeatExpOffboardingAnalyticsActions',
  events: {
    GetAnalyticsExpOffboarding: props<{
      offboardingId: ExpOffboarding['id'];
    }>(),
    GetAnalyticsExpOffboardingSuccess: props<{
      analytics: Array<ExpOffboardingAnalytics>;
    }>(),
    GetAnalyticsExpOffboardingFailure: props<{ message: string }>(),
    //
    GetAllAnalyticsSuccess: props<{
      analytics: Array<ExpOffboardingAnalytics>;
    }>(),
    //
    PostAnalyticsExpOffboarding: props<{
      analytics: ClientDataType<ExpOffboardingAnalytics>;
    }>(),
    PostAnalyticsExpOffboardingSuccess: props<{
      analytics: ExpOffboardingAnalytics;
    }>(),
    PostAnalyticsExpOffboardingFailure: props<{ message: string }>(),
    //
    DeleteAnalyticsExpOffboarding: props<{
      id: ExpOffboardingAnalytics['id'];
    }>(),
    DeleteAnalyticsExpOffboardingSuccess: props<{
      id: ExpOffboardingAnalytics['id'];
    }>(),
    DeleteAnalyticsExpOffboardingFailure: props<{ message: string }>(),
  },
});
