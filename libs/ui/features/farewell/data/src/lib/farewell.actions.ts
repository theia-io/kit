import { Farewell } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatFarewellActions = createActionGroup({
  source: 'FeatFarewellActions',
  events: {
    GetFarewells: emptyProps(),
    GetFarewellsSuccess: props<{ farewells: Array<Farewell> }>(),
    GetFarewellsFailure: props<{ message: string }>(),
    GetFarewell: props<{
      id: string;
    }>(),
    GetFarewellSuccess: props<{ farewell: Farewell }>(),
    GetFarewellFailure: props<{ message: string }>(),
    CreateFarewell: props<{
      title: Farewell['title'];
      content: Farewell['content'];
    }>(),
    CreateFarewellSuccess: props<{ farewell: Farewell }>(),
    CreateFarewellFailure: props<{ message: string }>(),
    PutFarewell: props<{ farewell: Farewell }>(),
    PutFarewellSuccess: props<{ farewell: Farewell }>(),
    PutFarewellFailure: props<{ message: string }>(),
  },
});
