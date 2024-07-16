import { Profile } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatFollowActions = createActionGroup({
  source: 'FeatFollowActions',
  events: {
    GetSuggestionColleaguesToFollow: emptyProps(),
    GetSuggestionColleaguesToFollowSuccess: props<{
      profiles: Array<Profile>;
    }>(),
    GetSuggestionColleaguesToFollowFailure: props<{ message: string }>(),
  },
});
