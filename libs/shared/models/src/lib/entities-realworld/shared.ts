import { Contact } from '../contact/Contact';
import { Legal } from './legal';

export interface Skill {
  name: string;
  level: string;
}

export enum ExperienceType {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  SelfEmployed = 'Self-employed',
  Freelance = 'Freelance',
  Contract = 'Contract',
  Internship = 'Internship',
  Apprenticeship = 'Apprenticeship',
}

export enum LocationType {
  Office = 'Office',
  Remote = 'Remote',
  Hybrid = 'Hybrid'
}


export interface Experience {
  title: string;
  type: ExperienceType;
  company: string;
  country: string;
  city: string;
  locationType: LocationType;
  startDate: string; // isoDate
  endDate: string | null; // isoDate
  description?: string;
  skills?: Array<string>;
  links?: Array<string>;
  media?: Array<string>;
}

export interface Project {
  name: string;
  description: string;
  image: string;
  link: string;
}

export interface Education {
  name: string;
  level: string;
  start: number;
  url: string;
  end: number;
}

export interface Certificates extends Education {}

export interface CurriculumVitae {
  id: string;
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  companies: Legal[];
}

export interface CustomerInfo {
  contact: Contact;
  birthday: Date;
  location: string;
}
