import { Legal } from '@kitouch/shared-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FeatLegalApiActions = createActionGroup({
  source: 'FeatLegalApiActions',
  events: {
    GetCompanies: emptyProps(),
    GetCompaniesSuccess: props<{ companies: Array<Legal> }>(),
    GetCompaniesFailure: props<{ message: string }>(),
    AddCompanies: props<{ companies: Array<Pick<Legal, 'alias' | 'name'>> }>(),
    AddCompaniesSuccess: props<{
      companies: Array<Pick<Legal, 'alias' | 'name'>>;
    }>(),
    AddCompaniesFailure: props<{ message: string }>(),
  },
});
