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
    CreateFarewell: props<{ content: Farewell['content'] }>(),
    CreateFarewellSuccess: props<{ farewell: Farewell }>(),
    CreateFarewellFailure: props<{ message: string }>(),
  },
});
