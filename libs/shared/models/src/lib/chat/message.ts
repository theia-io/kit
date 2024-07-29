import { TimeStamp } from '../helpers';

export interface Attachments {
  type: string;
  url: string;
  thumbnailUrl: string;
}

export interface Message {
  // keys
  id: number;
  chatId: string;
  profileId: string;
  // business
  content: string;
  attachments: Attachments[];
  read: string;
  pinned: boolean;
  // meta
  timestamp: TimeStamp;
}

export interface ScheduledMessage extends Message {
  scheduled: boolean;
  scheduledTimestamp: TimeStamp;
}

export interface DraftMessage extends Message {}
