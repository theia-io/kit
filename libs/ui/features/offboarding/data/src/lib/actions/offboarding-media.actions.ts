import {
  ContractUploadedMedia,
  ExpOffboarding,
  Profile,
} from '@kitouch/shared-models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatOffboardingMediaActions = createActionGroup({
  source: 'FeatOffboardingMediaActions',
  events: {
    UploadOffboardingStorageMedia: props<{
      offboardingId: ExpOffboarding['id'];
      profileId: Profile['id'];
      items: Array<{ key: string; blob: Blob }>;
    }>(),
    UploadOffboardingStorageMediaSuccess: props<{
      offboardingId: ExpOffboarding['id'];
      profileId: Profile['id'];
      items: Array<ContractUploadedMedia>;
    }>(),
    UploadOffboardingStorageMediaFailure: props<{ message: string }>(),
    //
    DeleteOffboardingStorageMedia: props<{
      url: string;
    }>(),
    DeleteOffboardingStorageMediaSuccess: props<{
      url: string;
    }>(),
    DeleteOffboardingStorageMediaFailure: props<{ message: string }>(),
  },
});
