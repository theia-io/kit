import { Link, Picture } from '../helpers';
/** @FIXME include into TS itself (so not importing) */

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
  alias?: string;
  userId?: string /** @FIXME @TODO This is Profile depends on an Account and the Account on Profile?  */;
  legalId?: string; // so either user or some legal entity owns the profile. We can also take it further and have the
  // many owners to achieve "Group"? functionality with many admins?
  name: string;
  type?: ProfileType;
  status?: ProfileStatus;
  socials?: {
    linkedin: string;
    github: string;
    twitter: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    youtube: string;
  };
  // own
  title?: string;
  subtitle?: string;
  description?: string;
  pictures?: Array<Picture>;
  links?: Link[];
  // meta
  followers?: Array<{ id: Profile['id'] }>;
  following?: Array<{ id: Profile['id'] }>;
}
