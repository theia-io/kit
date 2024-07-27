import { Experience, User } from '@kitouch/shared/models';
import { createActionGroup, props } from '@ngrx/store';

export const FeatUserApiActions = createActionGroup({
  source: 'FeatUserApiActions',
  events: {
    SetUser: props<{ user: User }>(),
    AddExperience: props<{ experience: Experience }>(),
    AddExperienceSuccess: props<{ experiences: Array<Experience> }>(),
    AddExperienceFailure: props<{ message: string }>(),
    ModifyExperience: props<{ experience: Experience }>(),
    ModifyExperienceSuccess: props<{ experiences: Array<Experience> }>(),
    ModifyExperienceFailure: props<{ message: string }>(),
    DeleteExperience: props<{ experience: Experience }>(),
    DeleteExperienceSuccess: props<{ experience: Experience }>(),
    DeleteExperienceFailure: props<{ message: string }>(),
  },
});
