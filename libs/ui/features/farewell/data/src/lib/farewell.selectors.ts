import {
  Farewell,
  FarewellAnalytics,
  FarewellMedia,
} from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureFarewellState } from './farewell.reducers';

export interface FarewellFullView extends Farewell {
  media?: Array<FarewellMedia>;
  analytics?: FarewellAnalytics;
}

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

export const selectMedia = createSelector(
  selectFarewellState,
  (state) => state.media
);

export const selectFarewellById = (farewellId: string) =>
  createSelector(selectFarewells, (farewells) =>
    findFarewellById(farewellId, farewells)
  );

export const selectFarewellFullViewById = (farewellId: string) =>
  createSelector(
    selectFarewells,
    selectAnalytics,
    selectMedia,
    (farewells, analytics, medias): FarewellFullView | undefined => {
      const farewell = findFarewellById(farewellId, farewells);

      return farewell
        ? {
            ...farewell,
            media: findMediaFarewellById(farewell.id, medias),
            analytics: findAnalyticsFarewellById(farewell.id, analytics),
          }
        : undefined;
    }
  );

/** utils */
export const findFarewellById = (
  farewellId: string,
  farewells: Array<Farewell>
) => farewells.find((farewell) => farewell.id === farewellId);

export const findMediaFarewellById = (
  farewellId: string,
  medias: Array<FarewellMedia>
) => medias.filter((media) => media.farewellId === farewellId);

export const findAnalyticsFarewellById = (
  farewellId: string,
  analytics: Array<FarewellAnalytics>
) => analytics.find((analytic) => analytic.farewellId === farewellId);
