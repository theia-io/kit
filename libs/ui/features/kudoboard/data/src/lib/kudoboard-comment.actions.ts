import {
  ContractUploadedMedia,
  KudoBoard,
  KudoBoardComment,
} from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatKudoBoardCommentActions = createActionGroup({
  source: 'FeatKudoBoardCommentActions',
  events: {
    /** MongoDB */
    // get
    GetCommentsKudoBoard: props<{ kudoboardId: KudoBoard['id'] }>(),
    GetCommentsKudoBoardSuccess: props<{
      comments: Array<KudoBoardComment>;
    }>(),
    GetCommentsKudoBoardFailure: props<{ message: string }>(),
    // post
    PostCommentKudoBoard: props<{
      comment: ClientDataType<KudoBoardComment>;
    }>(),
    PostCommentKudoBoardSuccess: props<{
      comment: KudoBoardComment;
    }>(),
    PostCommentKudoBoardFailure: props<{ message: string }>(),
    // delete
    DeleteCommentKudoBoard: props<{
      id: KudoBoardComment['id'];
    }>(),
    DeleteCommentKudoBoardSuccess: props<{
      id: KudoBoardComment['id'];
    }>(),
    DeleteCommentKudoBoardFailure: props<{ message: string }>(),
    // MEDIA
    // Comment
    UploadKudoBoardCommentStorageMedia: props<{
      kudoBoardId: string;
      profileId: string;
      items: Array<{ key: string; blob: Blob }>;
    }>(),
    UploadKudoBoardCommentStorageMediaSuccess: props<{
      kudoBoardId: string;
      profileId: string;
      items: Array<ContractUploadedMedia>;
    }>(),
    UploadKudoBoardCommentStorageMediaFailure: props<{ message: string }>(),
    DeleteKudoBoardCommentStorageMedia: props<{
      url: string;
    }>(),
    DeleteKudoBoardCommentStorageMediaSuccess: props<{
      url: string;
    }>(),
    DeleteKudoBoardCommentStorageMediaFailure: props<{ message: string }>(),
  },
});
