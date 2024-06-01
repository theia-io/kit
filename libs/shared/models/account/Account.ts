import { CurriculumVitae } from '../CurriculumVitae';

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface Account {
  id: string;
  email: string;
  name: string;
  surname: string;
  profilePicture: string;
  pictures: Array<string>;
  cvs: Array<CurriculumVitae>;
  phone: string;
  address: string;
  birthday: Date;
  gender: string;
  password: string;
  role: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
