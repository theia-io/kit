import { createSelector } from '@ngrx/store';
import { FeatureFarewellState } from './farewell.reducers';

/** selectors */
const selectFarewellState = (state: { farewell: FeatureFarewellState }) =>
  state.farewell;

export const selectFarewells = createSelector(
  selectFarewellState,
  (state) => state.farewells
);
