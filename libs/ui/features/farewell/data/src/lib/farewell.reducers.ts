import { Farewell } from '@kitouch/shared-models';
import { mergeArrV2 } from '@kitouch/ui-shared';
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
    farewells,
  })),
  on(FeatFarewellActions.getFarewellSuccess, (state, { farewell }) => ({
    ...state,
    farewells: mergeArrV2([farewell], state.farewells),
  })),
  on(FeatFarewellActions.putFarewellSuccess, (state, { farewell }) => ({
    ...state,
    farewells: state.farewells.map((stateFarewell) => {
      if (stateFarewell._id === farewell._id) {
        return farewell;
      }
      return stateFarewell;
    }),
  }))
);