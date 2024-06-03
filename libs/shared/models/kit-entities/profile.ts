import { Link, Picture, TimeStamp } from '../helpers';

export enum ProfileType {
  Personal = 'Personal',
  Professional = 'Professional',
}

export interface Profile {
  id: string;
  name: string; // either this or id will be resolved as page
  type: ProfileType;
  // own
  title: string;
  subtitle: string;
  description: string;
  pictures: Array<Picture & TimeStamp>;
  links: Link[];
  // meta
  followers: string[]; // Profiles 
  following: string[]; // Profiles 
}
