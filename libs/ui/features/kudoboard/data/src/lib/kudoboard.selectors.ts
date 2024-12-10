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

export const selectKudoBoardById = (kudoboardId: KudoBoard['id']) =>
  createSelector(selectKudoBoards, (kudoBoards) =>
    findKudoBoardById(kudoboardId, kudoBoards)
  );

export const selectKudoBoardAnalyticsById = (kudoboardId: KudoBoard['id']) =>
  createSelector(selectAnalytics, (analytics) =>
    findAnalyticsKudoBoardById(kudoboardId, analytics)
  );

export const selectKudoBoardReactionsById = (kudoboardId: KudoBoard['id']) =>
  createSelector(selectReactions, (reactions) =>
    findKudoBoardReactionsByKudoBoardId(kudoboardId, reactions)
  );

export const selectKudoBoardCommentById = (commentId: KudoBoardComment['id']) =>
  createSelector(selectComments, (comments) =>
    comments.find(({ id }) => id === commentId)
  );

export const selectKudoBoardCommentsById = (kudoboardId: KudoBoard['id']) =>
  createSelector(selectComments, (comments) =>
    findKudoBoardCommentsByKudoBoardId(kudoboardId, comments)
  );

/** utils */
export const findKudoBoardById = (
  kudoboardId: KudoBoard['id'],
  kudoboards: Array<KudoBoard>
) => kudoboards.find((kudoboard) => kudoboard.id === kudoboardId);

export const findKudoBoardReactionsByKudoBoardId = (
  kudoboardId: KudoBoard['id'],
  reactions: Array<KudoBoardReaction>
) => reactions.filter((reaction) => reaction.kudoBoardId === kudoboardId);

export const findKudoBoardCommentsByKudoBoardId = (
  kudoboardId: KudoBoard['id'],
  comments: Array<KudoBoardComment>
) => comments.filter((comment) => comment.kudoBoardId === kudoboardId);

export const findAnalyticsKudoBoardById = (
  kudoboardId: KudoBoard['id'],
  analytics: Array<KudoBoardAnalytics>
) => analytics.filter((analytic) => analytic.kudoBoardId === kudoboardId);
