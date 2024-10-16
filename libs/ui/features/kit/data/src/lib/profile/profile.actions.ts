import { Profile } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatProfileApiActions = createActionGroup({
  source: 'FeatProfileApiActions',
  events: {
    SetCurrentProfile: props<{ profile: Profile }>(),
    SetProfiles: props<{ profiles: Array<Profile> }>(),
    GetFollowingProfiles: props<{ profileIds: Array<Profile['id']> }>(),
    GetFollowingProfilesSuccess: props<{ profiles: Array<Profile> }>(),
    GetFollowingProfilesFailure: emptyProps(),
    UpdateProfile: props<{ profile: Profile }>(),
    UpdateProfileSuccess: props<{ profile: Profile }>(),
    UpdateProfileFailure: props<{ message: string }>(),
    UploadProfilePicture: props<{ id: Profile['id']; pic: Blob }>(),
    UploadProfilePictureSuccess: props<{ id: Profile['id']; url: string }>(),
    UploadProfilePictureFailure: props<{ message: string }>(),
    UploadProfileBackground: props<{ id: Profile['id']; pic: Blob }>(),
    UploadProfileBackgroundSuccess: props<{ id: Profile['id']; url: string }>(),
    UploadProfileBackgroundFailure: props<{ message: string }>(),
  },
});
