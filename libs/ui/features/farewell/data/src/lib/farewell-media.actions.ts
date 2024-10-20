import { createActionGroup, props } from '@ngrx/store';

export const FeatFarewellMediaActions = createActionGroup({
  source: 'FeatFarewellMediaActions',
  events: {
    UploadFarewellStorageMedia: props<{
      farewellId: string;
      profileId: string;
      items: Array<{ key: string; blob: Blob }>;
    }>(),
    UploadFarewellStorageMediaSuccess: props<{
      farewellId: string;
      profileId: string;
      items: Array<{ key: string }>;
    }>(),
    UploadFarewellStorageMediaFailure: props<{ message: string }>(),
    DeleteFarewellStorageMedia: props<{
      url: string;
    }>(),
    DeleteFarewellStorageMediaSuccess: props<{
      url: string;
    }>(),
    DeleteFarewellStorageMediaFailure: props<{ message: string }>(),
  },
});
