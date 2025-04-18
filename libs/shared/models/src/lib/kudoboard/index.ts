import { ContractUploadedMedia } from '../contracts/media';
import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';

export enum KudoBoardStatus {
  Published = 'published',
  // CollectingResponses = 'collecting responses',
  Draft = 'draft',
  Removed = 'removed',
}

export enum KudoBoardEvents {
  PageOpened = 'page-opened',
  PageClosed = 'page-closed',
}

export interface KudoBoardAnalytics extends Partial<KitTimestamp> {
  id: string;
  kudoBoardId: KudoBoard['id'];
  event: KudoBoardEvents;
  timestamp?: Partial<KitTimestamp>;
}

export interface KudoBoardReaction extends Partial<KitTimestamp> {
  id: string;
  kudoBoardId: KudoBoard['id'];
  profileId?: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  timestamp?: Partial<KitTimestamp>;
}

export interface KudoBoardComment extends Partial<KitTimestamp> {
  id: string;
  kudoBoardId: KudoBoard['id'];
  profileId?: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  medias?: Array<ContractUploadedMedia>;
  timestamp?: Partial<KitTimestamp>;
}

export interface KudoBoard extends Partial<KitTimestamp> {
  id: string;
  profileId?: Profile['id'] | null;
  profile?: Profile;
  title: string;
  content?: string;
  recipient?: string;
  background?: string;
  status: KudoBoardStatus;
  /** @deprecated to be removed */
  timestamp?: Partial<KitTimestamp>;
}
