import { FarewellMedia } from '@kitouch/shared-models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatFarewellMediaActions = createActionGroup({
  source: 'FeatFarewellMediaActions',
  events: {
    /** S3 */
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
    /** MongoDB */
    GetMediasFarewellSuccess: props<{ medias: Array<FarewellMedia> }>(),
    GetMediasFarewellFailure: props<{ message: string }>(),
    PostMediasFarewellSuccess: props<{
      medias: Array<FarewellMedia>;
    }>(),
    PostMediasFarewellFailure: props<{ message: string }>(),
    PutMediaFarewell: props<{
      media: FarewellMedia;
    }>(),
    PutMediaFarewellSuccess: props<{
      media: FarewellMedia;
    }>(),
    PutMediaFarewellFailure: props<{ message: string }>(),
    DeleteMediaFarewell: props<{
      id: FarewellMedia['id'];
    }>(),
    DeleteMediaFarewellSuccess: props<{
      id: FarewellMedia['id'];
    }>(),
    DeleteMediaFarewellFailure: props<{ message: string }>(),
  },
});
