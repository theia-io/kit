import {
  ContractUploadedMedia,
  KudoBoard,
  Profile,
} from '@kitouch/shared-models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatKudoBoardMediaActions = createActionGroup({
  source: 'FeatKudoBoardMediaActions',
  events: {
    UploadKudoBoardStorageMedia: props<{
      kudoboardId: KudoBoard['id'];
      profileId: Profile['id'];
      items: Array<{ key: string; blob: Blob }>;
    }>(),
    UploadKudoBoardStorageMediaSuccess: props<{
      kudoboardId: KudoBoard['id'];
      profileId: Profile['id'];
      items: Array<ContractUploadedMedia>;
    }>(),
    UploadKudoBoardStorageMediaFailure: props<{ message: string }>(),
    //
    DeleteKudoBoardStorageMedia: props<{
      url: string;
    }>(),
    DeleteKudoBoardStorageMediaSuccess: props<{
      url: string;
    }>(),
    DeleteKudoBoardStorageMediaFailure: props<{ message: string }>(),
  },
});
