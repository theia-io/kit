import { Profile } from '../kit-entities';

import { Account } from '../account';
import { Languages } from '../helpers';
import { Company } from './company';
import {
  Certificates,
  CurriculumVitae,
  CustomerInfo,
  Education,
  Project,
  Skill,
} from './shared';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  accountId: Account['id'];
  profileId: Profile['id'];
  //];
  roles: UserRoles[];
  //
  name: string;
  surname: string;
  middleName: string;
  gender: Gender; // ids?
  languages: Languages[]; // ids?
  educations: Education[]; // ids?
  certificates: Certificates[]; // ids?
  cvs: Array<CurriculumVitae>;
  skills: Skill[]; // ids?
  projects: Project[]; // ids?
  companies: Company[]; // ids?
  //
  customerInfo: CustomerInfo;
  privateFields: keyof User;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOANSWER = 'noanswer',
}
