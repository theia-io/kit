import {
  Farewell,
  FarewellAnalytics,
  FarewellComment,
  FarewellReaction,
  Profile,
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

export const selectComments = createSelector(
  selectFarewellState,
  (state) => state.comments
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

export const selectFarewellCommentById = (commentId: string) =>
  createSelector(selectComments, (comments) =>
    comments.find(({ id }) => id === commentId)
  );

export const selectFarewellCommentsById = (farewellId: string) =>
  createSelector(selectComments, (comments) =>
    findFarewellCommentsByFarewellId(farewellId, comments)
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

export const findProfileFarewells = (
  profileId: Profile['id'],
  farewells: Array<Farewell>
) =>
  farewells.filter(
    (farewell) => (farewell.profileId ?? farewell.profile.id) === profileId
  );

export const findFarewellReactionsByFarewellId = (
  farewellId: string,
  reactions: Array<FarewellReaction>
) => reactions.filter((reaction) => reaction.farewellId === farewellId);

export const findFarewellCommentsByFarewellId = (
  farewellId: string,
  comments: Array<FarewellComment>
) => comments.filter((comment) => comment.farewellId === farewellId);

export const findAnalyticsFarewellById = (
  farewellId: string,
  analytics: Array<FarewellAnalytics>
) => analytics.find((analytic) => analytic.farewellId === farewellId);
