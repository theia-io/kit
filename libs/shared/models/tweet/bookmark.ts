import { Profile } from '../entities-kitouch';
import { Tweety } from './tweety';

export interface Bookmark {
  id: string;
  tweetId: Tweety['id'];
  profileId: Profile['id'];
}
