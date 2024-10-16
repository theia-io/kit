import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';

export enum FarewellStatus {
  Published = 'published',
  Draft = 'draft',
  Removed = 'removed',
}

export interface FarewellAnalytics {
  id: string;
  farewellId: string;
  viewed: number;
  timestamp: KitTimestamp;
}

export interface FarewellMedia {
  id: string;
  farewellId: string;
  profileId: string;
  url: string;
  timestamp: KitTimestamp;
}

export interface Farewell {
  id: string;
  profile: Profile;
  title: string;
  content: string;
  timestamp: KitTimestamp;
  status: FarewellStatus;
}
