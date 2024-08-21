import { Profile } from '../entities-kitouch';
import { TimeStamp } from '../helpers';

export interface FarewellAnalytics {
  id: string;
  farewellId: string;
  viewed: number;
}

export interface FarewellMedia {
  farewellId: string;
  profileId: string;
  url: string;
  timestamp: TimeStamp;
}

export interface Farewell {
  id: string;
  profile: Profile;
  title: string;
  content: string;
  viewed: number;
  timestamp: TimeStamp;
}
