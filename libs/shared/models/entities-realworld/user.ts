
import { Account } from '../account';
import { Languages } from '../helpers';
import { Legal } from './legal';
import {
  Certificates,
  CurriculumVitae,
  CustomerInfo,
  Education,
  Project,
  Skill,
} from './shared';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface User {
  // id
  accountId: Account['id'];
  // business
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
  companies: Legal[]; // ids?
  status: UserStatus;
  // meta
  customerInfo: CustomerInfo;
  privateFields: keyof User;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOANSWER = 'noanswer',
}