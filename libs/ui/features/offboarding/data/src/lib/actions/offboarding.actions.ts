import { ExpOffboarding, Profile } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { createActionGroup, props } from '@ngrx/store';

export const FeatExpOffboardingActions = createActionGroup({
  source: 'FeatExpOffboardingActions',
  events: {
    GetProfileExpOffboardings: props<{ profileId: Profile['id'] }>(),
    GetExpOffboardingsSuccess: props<{ offboardings: Array<ExpOffboarding> }>(),
    GetExpOffboardingsFailure: props<{ message: string }>(),
    //
    GetExpOffboarding: props<{
      id: string;
    }>(),
    GetExpOffboardingSuccess: props<{ offboarding: ExpOffboarding }>(),
    GetExpOffboardingFailure: props<{ id: string; message: string }>(),

    //
    CreateExpOffboarding: props<{
      offboarding: Omit<
        ClientDataType<ExpOffboarding>,
        | 'profile'
        | 'profileId'
        | 'profileIdsNetwork'
        | 'kudoboardIds'
        | 'farewellIds'
      >;
    }>(),
    CreateExpOffboardingSuccess: props<{ offboarding: ExpOffboarding }>(),
    CreateExpOffboardingFailure: props<{ message: string }>(),
    //
    PutExpOffboarding: props<{ offboarding: ExpOffboarding }>(),
    PutExpOffboardingSuccess: props<{ offboarding: ExpOffboarding }>(),
    PutExpOffboardingFailure: props<{ message: string }>(),
    //
    DeleteExpOffboarding: props<{ id: ExpOffboarding['id'] }>(),
    DeleteExpOffboardingSuccess: props<{ id: ExpOffboarding['id'] }>(),
    DeleteExpOffboardingFailure: props<{ message: string }>(),
  },
});
