import { Link, Picture, TimeStamp } from '../helpers';

export enum ProfileType {
  Personal = 'Physical',
  Professional = 'Professional',
  Company = 'Company',
}

export enum ProfileStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface Profile {
  id: string;
  userId?: string /** @FIXME @TODO This is Profile depends on an Account and the Account on Profile?  */;
  legalId?: string; // so either user or some legal entity owns the profile. We can also take it further and have the
  // many owners to achieve "Group"? functionality with many admins?
  name: string; // either this or id will be resolved as page
  type: ProfileType;
  status: ProfileStatus;
  // own
  title: string;
  subtitle: string;
  description: string;
  pictures: Array<Picture & TimeStamp>;
  links: Link[];
  // meta
  followers: Array<Profile['id']>;
  following: Array<Profile['id']>;
}
