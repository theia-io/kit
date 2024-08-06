import { Profile } from '../entities-kitouch';
import { TimeStamp } from '../helpers';

export interface Farewell {
  id: string;
  profile: Profile;
  title: string;
  content: string;
  viewed: number;
  timestamp: TimeStamp;
}
