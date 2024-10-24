import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';

export enum FarewellStatus {
  Published = 'published',
  Draft = 'draft',
  Removed = 'removed',
}

export interface FarewellAnalytics {
  id: string;
  farewellId: Farewell['id'];
  viewed: number;
  timestamp: KitTimestamp;
}

export interface FarewellReaction {
  id: string;
  farewellId: Farewell['id'];
  profileId: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  timestamp: KitTimestamp;
}

export interface FarewellComment {
  id: string;
  farewellId: Farewell['id'];
  profileId: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
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
