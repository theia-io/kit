import { Account } from '../account';
import { Profile } from '../entities-kitouch';
import { User } from '../entities-realworld';

export interface Auth0User {
  sub: string;
  email: string;
  name: string;
  surname: string;
  picture: string;
  email_verified: boolean;
}

export interface Auth0Kit extends Auth0User {
  account?: Account;
  user?: User;
  profiles?: Array<Profile>;
}
