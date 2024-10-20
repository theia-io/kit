import { Farewell, FarewellReaction } from '@kitouch/shared-models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatFarewellReactionActions = createActionGroup({
  source: 'FeatFarewellReactionActions',
  events: {
    /** MongoDB */
    // get
    GetReactionsFarewell: props<{ farewellId: Farewell['id'] }>(),
    GetReactionsFarewellSuccess: props<{
      reactions: Array<FarewellReaction>;
    }>(),
    GetReactionsFarewellFailure: props<{ message: string }>(),
    // post
    PostReactionFarewell: props<{
      reaction: FarewellReaction;
    }>(),
    PostReactionFarewellSuccess: props<{
      reaction: FarewellReaction;
    }>(),
    PostReactionFarewellFailure: props<{ message: string }>(),
    // delete
    DeleteReactionFarewell: props<{
      id: FarewellReaction['id'];
    }>(),
    DeleteReactionFarewellSuccess: props<{
      id: FarewellReaction['id'];
    }>(),
    DeleteReactionFarewellFailure: props<{ message: string }>(),
  },
});
