import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import { addOrUpdate, mergeArr } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatFarewellActions } from './farewell.actions';

export interface FeatureFarewellState {
  farewells: Array<Farewell>;
  analytics: Array<FarewellAnalytics>;
}

const featFarewellInitialState: FeatureFarewellState = {
  farewells: [],
  analytics: [],
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
  })),
  on(
    FeatFarewellActions.getAnalyticsFarewellSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: addOrUpdate(analytics, state.analytics),
    })
  )
);
