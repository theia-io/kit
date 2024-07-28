import { TimeStamp } from '../helpers';

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export enum AccountType {
  ADMIN = 'admin',
  USER = 'normal',
  GROUP = 'group',
}

export interface Account {
  // keys
  id: string;
  settingsId: string;
  // busines
  email: string[];
  type: AccountType;
  status: AccountStatus;
  // denormilized
  settings: {
    mfa: string[];
    // info, publicitly, searchibility, etc
    subscriptionOns: string[];
  };
  // meta
  timestamp: TimeStamp;
  // password?: string;
  // services?: Array<ThirdPartyServices>;
}
