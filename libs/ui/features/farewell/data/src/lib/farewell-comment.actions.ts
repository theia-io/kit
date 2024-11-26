import {
  ContractUploadedMedia,
  Farewell,
  FarewellComment,
} from '@kitouch/shared-models';
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
    // batch
    BatchCommentsFarewell: props<{
      comments: Array<ClientDataType<FarewellComment>>;
    }>(),
    BatchCommentsFarewellSuccess: props<{
      comments: Array<FarewellComment>;
    }>(),
    BatchCommentsFarewellFailure: props<{ message: string }>(),
    // delete
    DeleteCommentFarewell: props<{
      id: FarewellComment['id'];
    }>(),
    DeleteCommentFarewellSuccess: props<{
      id: FarewellComment['id'];
    }>(),
    DeleteCommentFarewellFailure: props<{ message: string }>(),
    // MEDIA
    UploadFarewellCommentStorageMedia: props<{
      farewellId: string;
      profileId: string;
      items: Array<{ key: string; blob: Blob }>;
    }>(),
    UploadFarewellCommentStorageMediaSuccess: props<{
      farewellId: string;
      profileId: string;
      items: Array<ContractUploadedMedia>;
    }>(),
    UploadFarewellCommentStorageMediaFailure: props<{ message: string }>(),
    DeleteFarewellCommentStorageMedia: props<{
      url: string;
    }>(),
    DeleteFarewellCommentStorageMediaSuccess: props<{
      url: string;
    }>(),
    DeleteFarewellCommentStorageMediaFailure: props<{ message: string }>(),
  },
});
