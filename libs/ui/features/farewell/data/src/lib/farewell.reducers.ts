import {
  Farewell,
  FarewellAnalytics,
  FarewellReaction,
} from '@kitouch/shared-models';
import { addOrUpdate, mergeArr, remove } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatFarewellReactionActions } from './farewell-reaction.actions';
import { FeatFarewellActions } from './farewell.actions';

export interface FeatureFarewellState {
  farewells: Array<Farewell>;
  analytics: Array<FarewellAnalytics>;
  reactions: Array<FarewellReaction>;
}

const featFarewellInitialState: FeatureFarewellState = {
  farewells: [],
  analytics: [],
  reactions: [],
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
    FeatFarewellActions.createFarewellSuccess,
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
  /** Reactions */
  on(
    FeatFarewellReactionActions.getReactionsFarewellSuccess,
    (state, { reactions }) => ({
      ...state,
      reactions: mergeArr(reactions, state.reactions),
    })
  ),
  on(
    FeatFarewellReactionActions.postReactionFarewellSuccess,
    (state, { reaction }) => ({
      ...state,
      reactions: addOrUpdate(reaction, state.reactions),
    })
  ),
  on(
    FeatFarewellReactionActions.deleteReactionFarewellSuccess,
    (state, { id }) => ({
      ...state,
      reactions: remove(id, state.reactions),
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
