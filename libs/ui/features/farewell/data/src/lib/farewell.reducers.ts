import { Farewell } from '@kitouch/shared-models';
import { addOrUpdate, mergeArr } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatFarewellActions } from './farewell.actions';

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
  ),
  on(FeatFarewellActions.deleteFarewellSuccess, (state, { id }) => ({
    ...state,
    farewells: state.farewells.filter((farewell) => farewell.id !== id),
  }))
);
