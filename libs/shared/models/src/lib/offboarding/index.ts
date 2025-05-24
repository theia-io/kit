import { KitTimestamp } from '../helpers';

export enum ExpOffboardingStatus {
  Created = 'created',
  Draft = 'draft',
  Collecting = 'collecting',
  Shared = 'shared',
  Responded = 'responded',
  Closed = 'closed',
}

export interface ExpOffboarding extends Partial<KitTimestamp> {
  id: string;
  kudoboardIds: Array<string>;
  farewellIds: Array<string>;
  profileId: string;
  collaboratorEmails: Array<string>;
  receiverEmail: string;
  content: string;
  status: ExpOffboardingStatus;
}
