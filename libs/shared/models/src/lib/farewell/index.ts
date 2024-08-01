import { Profile } from '../entities-kitouch';
import { TimeStamp } from '../helpers';

export interface Farewell extends Realm.Services.MongoDB.Document {
  profile: Profile;
  title: string;
  content: string;
  timestamp: TimeStamp;
  viewed: number;
}
