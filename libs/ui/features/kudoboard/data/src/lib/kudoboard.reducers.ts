import {
  KudoBoard,
  KudoBoardAnalytics,
  KudoBoardComment,
  KudoBoardReaction,
} from '@kitouch/shared-models';
import { addOrUpdate, mergeArr, remove } from '@kitouch/utils';
import { createReducer, on } from '@ngrx/store';
import { FeatKudoBoardReactionActions } from './kudoboard-reaction.actions';
import { FeatKudoBoardActions } from './kudoboard.actions';
import { FeatKudoBoardCommentActions } from './kudoboard-comment.actions';
import { FeatKudoBoardAnalyticsActions } from './kudoboard-analytics.actions';

export interface FeatureKudoBoardState {
  kudoboards: Array<KudoBoard>;
  analytics: Array<KudoBoardAnalytics>;
  reactions: Array<KudoBoardReaction>;
  comments: Array<KudoBoardComment>;
}

const featKudoBoardInitialState: FeatureKudoBoardState = {
  kudoboards: [],
  analytics: [],
  reactions: [],
  comments: [],
};

export const featKudoBoardReducer = createReducer(
  featKudoBoardInitialState,
  on(FeatKudoBoardActions.getKudoBoardsSuccess, (state, { kudoboards }) => ({
    ...state,
    kudoboards: mergeArr(kudoboards, state.kudoboards),
  })),
  on(
    FeatKudoBoardActions.putKudoBoardSuccess,
    FeatKudoBoardActions.getKudoBoardSuccess,
    FeatKudoBoardActions.createKudoBoardSuccess,
    (state, { kudoboard }) => ({
      ...state,
      kudoboards: addOrUpdate(kudoboard, state.kudoboards),
    })
  ),
  on(FeatKudoBoardActions.deleteKudoBoardSuccess, (state, { id }) => ({
    ...state,
    kudoboards: remove(id, state.kudoboards),
  })),
  /** Reactions */
  on(
    FeatKudoBoardReactionActions.getReactionsKudoBoardSuccess,
    (state, { reactions }) => ({
      ...state,
      reactions: mergeArr(reactions, state.reactions),
    })
  ),
  on(
    FeatKudoBoardReactionActions.postReactionKudoBoardSuccess,
    (state, { reaction }) => ({
      ...state,
      reactions: addOrUpdate(reaction, state.reactions),
    })
  ),
  on(
    FeatKudoBoardReactionActions.deleteReactionKudoBoardSuccess,
    (state, { id }) => ({
      ...state,
      reactions: remove(id, state.reactions),
    })
  ),
  /** Comments */
  on(
    FeatKudoBoardCommentActions.getCommentsKudoBoardSuccess,
    (state, { comments }) => ({
      ...state,
      comments: mergeArr(comments, state.comments),
    })
  ),
  on(
    FeatKudoBoardCommentActions.postCommentKudoBoardSuccess,
    (state, { comment }) => ({
      ...state,
      comments: addOrUpdate(comment, state.comments),
    })
  ),
  on(
    FeatKudoBoardCommentActions.deleteCommentKudoBoardSuccess,
    (state, { id }) => ({
      ...state,
      comments: remove(id, state.comments),
    })
  ),
  /** Analytics */
  on(
    FeatKudoBoardAnalyticsActions.getAllAnalyticsSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: mergeArr(analytics, state.analytics),
    })
  ),
  on(
    FeatKudoBoardAnalyticsActions.getAnalyticsKudoBoardSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: mergeArr(state.analytics, analytics),
    })
  ),
  on(
    FeatKudoBoardAnalyticsActions.postAnalyticsKudoBoardSuccess,
    (state, { analytics }) => ({
      ...state,
      analytics: addOrUpdate(analytics, state.analytics),
    })
  ),
  on(
    FeatKudoBoardAnalyticsActions.deleteAnalyticsKudoBoardSuccess,
    (state, { id }) => ({
      ...state,
      analytics: remove(id, state.analytics),
    })
  )
);
