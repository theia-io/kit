import { Farewell, FarewellComment } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatFarewellCommentActions = createActionGroup({
  source: 'FeatFarewellCommentActions',
  events: {
    /** MongoDB */
    // get
    GetCommentsFarewell: props<{ farewellId: Farewell['id'] }>(),
    GetCommentsFarewellSuccess: props<{
      comments: Array<FarewellComment>;
    }>(),
    GetCommentsFarewellFailure: props<{ message: string }>(),
    // post
    PostCommentFarewell: props<{
      comment: ClientDataType<FarewellComment>;
    }>(),
    PostCommentFarewellSuccess: props<{
      comment: FarewellComment;
    }>(),
    PostCommentFarewellFailure: props<{ message: string }>(),
    // delete
    DeleteCommentFarewell: props<{
      id: FarewellComment['id'];
    }>(),
    DeleteCommentFarewellSuccess: props<{
      id: FarewellComment['id'];
    }>(),
    DeleteCommentFarewellFailure: props<{ message: string }>(),
  },
});
