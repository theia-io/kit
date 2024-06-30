import { Legal } from '@kitouch/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatLegalApiActions = createActionGroup({
  source: 'FeatLegalApiActions',
  events: {
    GetCompanies: emptyProps(),
    GetCompaniesSuccess: props<{ companies: Array<Legal> }>(),
    GetCompaniesFailure: props<{ message: string }>(),
  },
});
