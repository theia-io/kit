import { ThirdPartyServices } from '../3dServices/3d';
import { TimeStamp } from '../helpers';
import { AccountSettings } from './settings';

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export enum AccountType {
  ADMIN = 'admin',
  USER = 'user',
  GROUP = 'group',
}

export interface Account {
  // keys
  id: string;
  settingIds: AccountSettings['id'][];
  // meta
  type: AccountType;
  status: AccountStatus;
  password?: string;
  services: ThirdPartyServices;
  timestamp: TimeStamp;
}
