import { Profile } from '../entities-kitouch';
import { AnalyticsEvent, KitTimestamp } from '../helpers';

export enum ExpOffboardingStatus {
  Draft = 'draft',
  Collecting = 'collecting',
  Shared = 'shared',
  Responded = 'responded',
  Deleted = 'deleted',
}

export interface ExpOffboarding extends KitTimestamp {
  id: string;
  kudoboardIds: Array<string>;
  farewellIds: Array<string>;
  profileId: string;
  profile: Profile;
  collaboratorEmails: Array<string>;
  receiverEmail: string;
  title: string;
  content: string;
  companyReviews: Array<string>;
  status: ExpOffboardingStatus;
  profileIdsNetwork: Array<string>;
}

export interface ExpOffboardingAnalytics extends KitTimestamp {
  id: string;
  offboardingId: string;
  profileId: string;
  event: AnalyticsEvent;
}
