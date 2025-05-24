import { AnalyticsEvent, KitTimestamp } from '../helpers';

export enum ExpOffboardingStatus {
  Draft = 'draft',
  Collecting = 'collecting',
  Shared = 'shared',
  Responded = 'responded',
  Deleted = 'deleted',
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
  profileIdsNetwork: Array<string>;
}

export interface ExpOffboardingAnalytics extends Partial<KitTimestamp> {
  id: string;
  offboardingId: string;
  profileId: string;
  event: AnalyticsEvent;
}
