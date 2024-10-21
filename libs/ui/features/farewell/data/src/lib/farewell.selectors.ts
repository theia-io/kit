import {
  Farewell,
  FarewellAnalytics,
  FarewellReaction,
} from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureFarewellState } from './farewell.reducers';

export interface FarewellFullView extends Farewell {
  reactions?: Array<FarewellReaction>;
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

export const selectReactions = createSelector(
  selectFarewellState,
  (state) => state.reactions
);

export const selectFarewellById = (farewellId: string) =>
  createSelector(selectFarewells, (farewells) =>
    findFarewellById(farewellId, farewells)
  );

export const selectFarewellAnalyticsById = (farewellId: string) =>
  createSelector(selectAnalytics, (analytics) =>
    findAnalyticsFarewellById(farewellId, analytics)
  );

export const selectFarewellReactionsById = (farewellId: string) =>
  createSelector(selectReactions, (reactions) =>
    findFarewellReactionsByFarewellId(farewellId, reactions)
  );

export const selectFarewellFullViewById = (farewellId: string) =>
  createSelector(
    selectFarewells,
    selectAnalytics,
    selectReactions,
    (farewells, analytics, reactions): FarewellFullView | undefined => {
      const farewell = findFarewellById(farewellId, farewells);

      return farewell
        ? {
            ...farewell,
            reactions: findFarewellReactionsByFarewellId(
              farewell.id,
              reactions
            ),
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

export const findFarewellReactionsByFarewellId = (
  farewellId: string,
  reactions: Array<FarewellReaction>
) => reactions.filter((reaction) => reaction.farewellId === farewellId);

export const findAnalyticsFarewellById = (
  farewellId: string,
  analytics: Array<FarewellAnalytics>
) => analytics.find((analytic) => analytic.farewellId === farewellId);
