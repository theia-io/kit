import { Farewell } from '@kitouch/shared-models';
import { createReducer, on } from '@ngrx/store';
import { FeatFarewellActions } from './farewell.actions';
import { mergeArr, addOrUpdate } from '@kitouch/utils';

export interface FeatureFarewellState {
  farewells: Array<Farewell>;
}

const featFarewellInitialState: FeatureFarewellState = {
  farewells: [],
};

export const featFarewellReducer = createReducer(
  featFarewellInitialState,
  on(FeatFarewellActions.getFarewellsSuccess, (state, { farewells }) => ({
    ...state,
    farewells: mergeArr(farewells, state.farewells),
  })),
  on(
    FeatFarewellActions.putFarewellSuccess,
    FeatFarewellActions.getFarewellSuccess,
    (state, { farewell }) => ({
      ...state,
      farewells: addOrUpdate(farewell, state.farewells),
    })
  )
);
