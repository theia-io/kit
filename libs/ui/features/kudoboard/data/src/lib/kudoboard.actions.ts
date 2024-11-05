import { KudoBoard, Profile } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatKudoBoardActions = createActionGroup({
  source: 'FeatKudoBoardActions',
  events: {
    GetProfileKudoBoards: props<{ profileId: Profile['id'] }>(),
    GetKudoBoardsSuccess: props<{ kudoboards: Array<KudoBoard> }>(),
    GetKudoBoardsFailure: props<{ message: string }>(),
    //
    GetKudoBoard: props<{
      id: string;
    }>(),
    GetKudoBoardSuccess: props<{ kudoboard: KudoBoard }>(),
    GetKudoBoardFailure: props<{ message: string }>(),

    //
    CreateKudoBoard: props<{ kudoboard: ClientDataType<KudoBoard> }>(),
    CreateKudoBoardSuccess: props<{ kudoboard: KudoBoard }>(),
    CreateKudoBoardFailure: props<{ message: string }>(),
    //
    PutKudoBoard: props<{ kudoboard: KudoBoard }>(),
    PutKudoBoardSuccess: props<{ kudoboard: KudoBoard }>(),
    PutKudoBoardFailure: props<{ message: string }>(),
    //
    DeleteKudoBoard: props<{ id: KudoBoard['id'] }>(),
    DeleteKudoBoardSuccess: props<{ id: KudoBoard['id'] }>(),
    DeleteKudoBoardFailure: props<{ message: string }>(),
  },
});
