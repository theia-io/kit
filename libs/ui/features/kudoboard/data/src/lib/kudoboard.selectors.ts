import {
  KudoBoard,
  KudoBoardAnalytics,
  KudoBoardComment,
  KudoBoardReaction,
} from '@kitouch/shared-models';
import { createSelector } from '@ngrx/store';
import { FeatureKudoBoardState } from './kudoboard.reducers';

/** selectors */
const selectKudoBoardState = (state: { kudoboard: FeatureKudoBoardState }) =>
  state.kudoboard;

export const selectKudoBoards = createSelector(
  selectKudoBoardState,
  (state) => state.kudoboards
);

export const selectAnalytics = createSelector(
  selectKudoBoardState,
  (state) => state.analytics
);

export const selectReactions = createSelector(
  selectKudoBoardState,
  (state) => state.reactions
);

export const selectComments = createSelector(
  selectKudoBoardState,
  (state) => state.comments
);

export const selectKudoBoardById = (kudoboardId: string) =>
  createSelector(selectKudoBoards, (kudoBoards) =>
    findKudoBoardById(kudoboardId, kudoBoards)
  );

export const selectKudoBoardAnalyticsById = (kudoboardId: string) =>
  createSelector(selectAnalytics, (analytics) =>
    findAnalyticsKudoBoardById(kudoboardId, analytics)
  );

export const selectKudoBoardReactionsById = (kudoboardId: string) =>
  createSelector(selectReactions, (reactions) =>
    findKudoBoardReactionsByKudoBoardId(kudoboardId, reactions)
  );

export const selectKudoBoardCommentsById = (kudoboardId: string) =>
  createSelector(selectComments, (comments) =>
    findKudoBoardCommentsByKudoBoardId(kudoboardId, comments)
  );

/** utils */
export const findKudoBoardById = (
  kudoboardId: string,
  kudoboards: Array<KudoBoard>
) => kudoboards.find((kudoboard) => kudoboard.id === kudoboardId);

export const findKudoBoardReactionsByKudoBoardId = (
  kudoboardId: string,
  reactions: Array<KudoBoardReaction>
) => reactions.filter((reaction) => reaction.kudoBoardId === kudoboardId);

export const findKudoBoardCommentsByKudoBoardId = (
  kudoboardId: string,
  comments: Array<KudoBoardComment>
) => comments.filter((comment) => comment.kudoBoardId === kudoboardId);

export const findAnalyticsKudoBoardById = (
  kudoboardId: string,
  analytics: Array<KudoBoardAnalytics>
) => analytics.find((analytic) => analytic.kudoBoardId === kudoboardId);
