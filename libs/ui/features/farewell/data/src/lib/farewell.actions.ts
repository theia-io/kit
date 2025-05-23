import { Farewell, FarewellAnalytics, Profile } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatFarewellActions = createActionGroup({
  source: 'FeatFarewellActions',
  events: {
    GetProfileFarewells: props<{ profileId: Profile['id'] }>(),
    GetFarewellsSuccess: props<{ farewells: Array<Farewell> }>(),
    GetFarewellsFailure: props<{ message: string }>(),
    //
    GetFarewell: props<{
      id: string;
    }>(),
    GetFarewellSuccess: props<{ farewell: Farewell }>(),
    GetFarewellFailure: props<{ message: string }>(),

    //
    CreateFarewell: props<{ farewell: ClientDataType<Farewell> }>(),
    CreateFarewellSuccess: props<{ farewell: Farewell }>(),
    CreateFarewellFailure: props<{ message: string }>(),
    //
    PutFarewell: props<{ farewell: Farewell }>(),
    PutFarewellSuccess: props<{ farewell: Farewell }>(),
    PutFarewellFailure: props<{ message: string }>(),
    //
    DeleteFarewell: props<{ id: Farewell['id'] }>(),
    DeleteFarewellSuccess: props<{ id: Farewell['id'] }>(),
    DeleteFarewellFailure: props<{ message: string }>(),
    /** Analytics **/
    GetAnalyticsFarewell: props<{
      farewellId: string;
    }>(),
    GetAnalyticsFarewellSuccess: props<{ analytics: FarewellAnalytics }>(),
    GetAnalyticsFarewellFailure: props<{ message: string }>(),
    GetAllAnalyticsSuccess: props<{ analytics: Array<FarewellAnalytics> }>(),
    PostAnalyticsFarewell: props<{
      analytics: Omit<FarewellAnalytics, 'id'>;
    }>(),
    PostAnalyticsFarewellSuccess: props<{ analytics: FarewellAnalytics }>(),
    PostAnalyticsFarewellFailure: props<{ message: string }>(),
    DeleteAnalyticsFarewell: props<{ id: FarewellAnalytics['id'] }>(),
    DeleteAnalyticsFarewellSuccess: props<{ id: FarewellAnalytics['id'] }>(),
    DeleteAnalyticsFarewellFailure: props<{ message: string }>(),
    PutAnalyticsFarewell: props<{
      analytics: FarewellAnalytics;
    }>(),
    PutAnalyticsFarewellSuccess: props<{
      analytics: FarewellAnalytics;
    }>(),
    PutAnalyticsFarewellFailure: props<{ message: string }>(),
  },
});
