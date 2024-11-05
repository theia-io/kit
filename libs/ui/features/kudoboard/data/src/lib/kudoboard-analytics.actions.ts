import { KudoBoard, KudoBoardAnalytics } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatKudoBoardAnalyticsActions = createActionGroup({
  source: 'FeatKudoBoardAnalyticsActions',
  events: {
    GetAnalyticsKudoBoard: props<{
      kudoBoardId: KudoBoard['id'];
    }>(),
    GetAnalyticsKudoBoardSuccess: props<{
      analytics: Array<KudoBoardAnalytics>;
    }>(),
    GetAnalyticsKudoBoardFailure: props<{ message: string }>(),
    //
    GetAllAnalyticsSuccess: props<{ analytics: Array<KudoBoardAnalytics> }>(),
    //
    PostAnalyticsKudoBoard: props<{
      analytics: ClientDataType<KudoBoardAnalytics>;
    }>(),
    PostAnalyticsKudoBoardSuccess: props<{ analytics: KudoBoardAnalytics }>(),
    PostAnalyticsKudoBoardFailure: props<{ message: string }>(),
    //
    DeleteAnalyticsKudoBoard: props<{ id: KudoBoardAnalytics['id'] }>(),
    DeleteAnalyticsKudoBoardSuccess: props<{ id: KudoBoardAnalytics['id'] }>(),
    DeleteAnalyticsKudoBoardFailure: props<{ message: string }>(),
  },
});
