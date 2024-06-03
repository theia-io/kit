import { Account } from '../account/account';
import { TimeStamp } from '../helpers';
import { Profile } from '../kit-entities';

//
export interface Tweety {
  // keys
  id: string;
  profileId: Profile['id'];
  retweetId?: Tweety['id']; // for retweets
  // business
  content: string;
  replies: Tweety[];
  comments: Tweety[];
  // Instagram-issue solution ->
  upProfileIds: Account['id'][];
  downProfileIds: Account['id'][];
  // />
  denormalization: {
    profile: Pick<Profile, 'id' | 'name' | 'type' | 'pictures'>;
  };
  // meta
  timestamp: TimeStamp;
}
