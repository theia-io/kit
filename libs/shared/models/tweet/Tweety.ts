import { Account } from '../account/account';
import { TimeStamp } from '../helpers';
import { Profile } from '../kit-entities';

/** 
 * @TODO @FIXME 
 * Lazy Loading for tweets could be implemented by Special interface 
```ts
interface PagedData<T> {
  data: T;
  totalNumber: number; // T.length
  limit: number;
  offset: number;
  next: string;
}
```
 * 
 * */

export enum TweetyType {
  Tweet = 'Tweet',
  Retweet = 'Retweet',
  Quotes = 'Quotes',
  Reply = 'Reply',
  Comment = 'Comment',
}

//
export interface Tweety {
  // keys
  id: string;
  profileId: Profile['id'];
  retweetId?: Tweety['id']; // for retweets, quotes, comments, replies
  // business
  content: string;
  replies?: Tweety[]; // PagedData<Tweety[]>;
  comments?: Tweety[]; // PagedData<Tweety[]>;
  // Instagram-issue solution ->
  upProfileIds: Account['id'][];
  downProfileIds: Account['id'][];
  // />
  // some statistics connections
  denormalization: {
    profile: Pick<Profile, 'id' | 'name' | 'type' | 'pictures'>;
  };
  // meta
  type: TweetyType;
  timestamp: TimeStamp;
}
