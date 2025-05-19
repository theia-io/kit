import { Profile } from '@kitouch/shared-models';
import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

export const noopAction = createAction('[FeatProfileApiActions] noop');

export const FeatProfileApiActions = createActionGroup({
  source: 'FeatProfileApiActions',
  events: {
    SetCurrentProfile: props<{ profile: Profile }>(),
    SetCurrentProfileError: props<{ message: string }>(),
    /** @deprecated use FeatProfileActions.addProfiles */
    SetProfiles: props<{ profiles: Array<Profile> }>(),
    // get profiles
    GetProfiles: props<{ profileIds: Array<Profile['id']> }>(),
    GetProfilesSuccess: props<{ profiles: Array<Profile> }>(),
    GetProfilesFailure: emptyProps(),
    // Update profile
    UpdateProfile: props<{ profile: Profile }>(),
    UpdateProfileSuccess: props<{ profile: Profile }>(),
    UpdateProfileFailure: props<{ message: string }>(),
    // Update picture
    UploadProfilePicture: props<{ id: Profile['id']; pic: Blob }>(),
    UploadProfilePictureSuccess: props<{ id: Profile['id']; url: string }>(),
    UploadProfilePictureFailure: props<{ message: string }>(),
    // Update background
    UploadProfileBackground: props<{ id: Profile['id']; pic: Blob }>(),
    UploadProfileBackgroundSuccess: props<{ id: Profile['id']; url: string }>(),
    UploadProfileBackgroundFailure: props<{ message: string }>(),
    // get profile  followers
    GetProfileFollowers: props<{ profileId: Profile['id'] }>(),
    GetProfileFollowersSuccess: props<{ profiles: Array<Profile> }>(),
    GetProfileFollowersFailure: emptyProps(),
  },
});

export const FeatProfileActions = createActionGroup({
  source: 'FeatProfileActions',
  events: {
    AddProfiles: props<{ profiles: Array<Profile> }>(),
    /** don't override existing profiles if such exist */
    AddProfilesSoftly: props<{ profiles: Array<Profile> }>(),
  },
});
