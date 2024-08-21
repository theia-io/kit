import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureFarewellState } from './farewell.reducers';

/** selectors */
const selectFarewellState = (state: { farewell: FeatureFarewellState }) =>
  state.farewell;

export const selectFarewells = createSelector(
  selectFarewellState,
  (state) => state.farewells
);

export const selectAnalytics = createSelector(
  selectFarewellState,
  (state) => state.analytics
);

export const selectFarewellById = (farewellId: string) =>
  createSelector(selectFarewells, (farewells) =>
    findFarewellById(farewellId, farewells)
  );

/** utils */
export const findFarewellById = (
  farewellId: string,
  farewells: Array<Farewell>
) => farewells.find((farewell) => farewell.id === farewellId);

export const findAnalyticsFarewellById = (
  farewellId: string,
  analytics: Array<FarewellAnalytics>
) => analytics.find((analytic) => analytic.farewellId === farewellId);
