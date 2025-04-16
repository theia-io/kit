import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';
import { Tweety } from './tweety';

export interface Bookmark extends KitTimestamp {
  id: string;
  tweetId: Tweety['id'];
  profileIdTweetyOwner: Profile['id'];
  profileIdBookmarker: Profile['id'];
}
