import { Account } from '../account/account';
import { Profile } from '../entities-kitouch';
import { TimeStamp } from '../helpers';

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
  Quote = 'quote',
}

export interface TweetComment extends Partial<TimeStamp> {
  profileId: Profile['id'];
  content: string;
}

//
export interface Tweety extends Realm.Services.MongoDB.Document {
  // keys
  id: string;
  //
  profileId: Profile['id'];
  referenceId?: Tweety['id']; // for retweets, quotes, comments, replies
  referenceProfileId?: Profile['id'];
  // business
  content: string;
  comments?: Partial<TweetComment>[]; // PagedData<Tweety[]>;
  replies?: Partial<Tweety>[]; // PagedData<Tweety[]>;
  // Instagram-issue solution ->
  upProfileIds?: Account['id'][];
  downProfileIds?: Account['id'][];
  // />
  // some statistics connections
  denormalization?: {
    profile: Pick<Profile, 'id' | 'name' | 'type' | 'pictures'>;
  };
  // meta
  type?: TweetyType;
  timestamp?: TimeStamp;
}

export class TweetySchema {}
