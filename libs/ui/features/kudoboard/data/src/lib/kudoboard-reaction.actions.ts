import { KudoBoard, KudoBoardReaction } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatKudoBoardReactionActions = createActionGroup({
  source: 'FeatKudoBoardReactionActions',
  events: {
    /** MongoDB */
    // get
    GetReactionsKudoBoard: props<{ kudoBoardId: KudoBoard['id'] }>(),
    GetReactionsKudoBoardSuccess: props<{
      reactions: Array<KudoBoardReaction>;
    }>(),
    GetReactionsKudoBoardFailure: props<{ message: string }>(),
    // post
    PostReactionKudoBoard: props<{
      reaction: ClientDataType<KudoBoardReaction>;
    }>(),
    PostReactionKudoBoardSuccess: props<{
      reaction: KudoBoardReaction;
    }>(),
    PostReactionKudoBoardFailure: props<{ message: string }>(),
    // delete
    DeleteReactionKudoBoard: props<{
      id: KudoBoardReaction['id'];
    }>(),
    DeleteReactionKudoBoardSuccess: props<{
      id: KudoBoardReaction['id'];
    }>(),
    DeleteReactionKudoBoardFailure: props<{ message: string }>(),
  },
});
