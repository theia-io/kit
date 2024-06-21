import { Contact } from '../Contact/Contact';
import { Legal } from './legal';

export interface Skill {
  name: string;
  level: string;
}

export interface Experience {
  title: string;
  period: Array<{start: string, end: string}>;
  description?: string;
  link?: string;
  image?: string;
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
