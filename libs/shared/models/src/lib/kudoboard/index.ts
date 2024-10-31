import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';

export enum KudoBoardStatus {
  Published = 'published',
  Draft = 'draft',
  Removed = 'removed',
}

export enum KudoBoardEvents {
  PageOpened = 'page-opened',
  PageClosed = 'page-closed',
}

export interface KudoBoardAnalytics {
  id: string;
  kudoBoardId: KudoBoard['id'];
  event: KudoBoardEvents;
  timestamp: KitTimestamp;
}

export interface KudoBoardReaction {
  id: string;
  kudoBoardId: KudoBoard['id'];
  profileId?: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  timestamp: KitTimestamp;
}

export interface KudoBoardComment {
  id: string;
  kudoBoardId: KudoBoard['id'];
  profileId?: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  timestamp: KitTimestamp;
}

export interface KudoBoard {
  id: string;
  profileId?: Profile['id'] | null;
  profile?: Profile;
  title: string;
  recipient?: string;
  background?: string;
  status: KudoBoardStatus;
  timestamp: KitTimestamp;
}
