import { Experience, User } from '@kitouch/shared-models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatUserApiActions = createActionGroup({
  source: 'FeatUserApiActions',
  events: {
    GetUser: props<{ userId: User['id'] }>(),
    GetUserSuccess: props<{ user: User }>(),
    GetUserFailure: props<{ message: string }>(),
    SetUser: props<{ user: User | undefined | null }>(),
    AddExperience: props<{ experience: Experience }>(),
    AddExperienceSuccess: props<{ experience: Experience }>(),
    AddExperienceFailure: props<{ message: string }>(),
    EditExperience: props<{ experience: Experience }>(),
    DeleteExperience: props<{ experience: Experience }>(),
    DeleteExperienceSuccess: props<{ experience: Experience }>(),
    DeleteExperienceFailure: props<{ message: string }>(),
  },
});
