import { Profile } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatProfileApiActions = createActionGroup({
  source: 'FeatProfileApiActions',
  events: {
    SetCurrentProfile: props<{ profile: Profile }>(),
    SetProfiles: props<{ profiles: Array<Profile> }>(),
    GetFollowingProfiles: props<{ profileIds: Array<Profile['id']> }>(),
    GetFollowingProfilesSuccess: props<{ profiles: Array<Profile> }>(),
    GetFollowingProfilesFailure: emptyProps(),
    UpdateProfile: props<{ profile: Partial<Profile> }>(),
    UpdateProfileSuccess: props<{ profile: Partial<Profile> }>(),
    UpdateProfileFailure: props<{ message: string }>(),
  },
});
