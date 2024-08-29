import {
  Farewell,
  FarewellAnalytics,
  FarewellMedia,
} from '@kitouch/shared-models';
import { addOrUpdate, mergeArr, remove } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatFarewellActions } from './farewell.actions';

export interface FeatureFarewellState {
  farewells: Array<Farewell>;
  analytics: Array<FarewellAnalytics>;
  media: Array<FarewellMedia>;
}

const featFarewellInitialState: FeatureFarewellState = {
  farewells: [],
  analytics: [],
  media: [],
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
    // farewells: state.farewells.filter((farewell) => farewell.id !== id),
    farewells: remove(id, state.farewells),
  })),
  /** Media */
  on(
    FeatFarewellActions.getMediasFarewellSuccess,
    FeatFarewellActions.postMediasFarewellSuccess,
    (state, { medias }) => ({
      ...state,
      media: mergeArr(medias, state.media),
    })
  ),
  /** Analytics */
  on(FeatFarewellActions.getAllAnalyticsSuccess, (state, { analytics }) => ({
    ...state,
    analytics: mergeArr(analytics, state.analytics),
  })),
  on(
    FeatFarewellActions.getAnalyticsFarewellSuccess,
    FeatFarewellActions.postAnalyticsFarewellSuccess,
    FeatFarewellActions.putAnalyticsFarewellSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: addOrUpdate(analytics, state.analytics),
    })
  ),
  on(FeatFarewellActions.deleteAnalyticsFarewellSuccess, (state, { id }) => ({
    ...state,
    analytics: remove(id, state.analytics),
  }))
);
