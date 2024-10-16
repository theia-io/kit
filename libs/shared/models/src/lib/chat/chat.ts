import { KitTimestamp } from '../helpers';

export enum ChatStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ChatType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

//

export interface ChatSettings {
  // when group chat it can have an additional hard settings
}

export interface Chat {
  // keys
  id: number;
  // business
  profileIds: [];
  adminIds: [];
  name: string;
  description: string;
  links: string;
  // meta
  password: string;
  type: ChatType;
  status: ChatStatus;
  timestamp: KitTimestamp;
}
