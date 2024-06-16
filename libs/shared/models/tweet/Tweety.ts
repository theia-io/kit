import {prop} from '@typegoose/typegoose';

import { Account } from '../account/account';
import { TimeStamp } from '../helpers';
import { Profile } from '../entities-kitouch';

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
  Tweet = 'tweet',
  Retweet = 'retweet',
  Quotes = 'quotes',
  Reply = 'reply',
  Comment = 'comment',
}

//
export interface Tweety {
  // keys
  id: string;
  //
  profileId: Profile['id'];
  retweetId?: Tweety['id']; // for retweets, quotes, comments, replies
  // business
  content: string;
  comments?: Tweety[]; // PagedData<Tweety[]>;
  replies?: Tweety[]; // PagedData<Tweety[]>;
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

export class TweetySchema {
  
}