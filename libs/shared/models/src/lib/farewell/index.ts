import { ContractUploadedMedia } from '../contracts';
import { Profile } from '../entities-kitouch';
import { KitTimestamp } from '../helpers';
import { KudoBoard } from '../kudoboard';

export enum FarewellStatus {
  Published = 'published',
  Draft = 'draft',
  Removed = 'removed',
}

export interface FarewellAnalytics extends Partial<KitTimestamp> {
  id: string;
  farewellId: Farewell['id'];
  viewed: number;
  timestamp?: KitTimestamp;
}

export interface FarewellReaction extends Partial<KitTimestamp> {
  id: string;
  farewellId: Farewell['id'];
  profileId: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  timestamp?: KitTimestamp;
}

export interface FarewellComment extends Partial<KitTimestamp> {
  id: string;
  farewellId: Farewell['id'];
  profileId?: Profile['id'] | null;
  profile?: Profile;
  // meta: string;
  content: string;
  medias?: Array<ContractUploadedMedia>;
  timestamp?: KitTimestamp;
}

export interface Farewell extends Partial<KitTimestamp> {
  id: string;
  kudoBoardId?: KudoBoard['id'];
  kudoBoard?: KudoBoard;
  profileId: Profile['id'];
  profile?: Profile;
  title: string;
  content: string;
  status: FarewellStatus;
  // TODO @Danylo remove this
  timestamp?: KitTimestamp;
}
