import { ThirdPartyServices } from '../3dServices/3d';
import { TimeStamp } from '../helpers';

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
  settings: {
    mfa: string[];
    // info, publicitly, searchibility, etc
    subscriptionOns: string[];
  };

  // meta
  timestamp: TimeStamp;
  type: AccountType;
  status: AccountStatus;
  password?: string;
  services?: Array<ThirdPartyServices>;
}
