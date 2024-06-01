import { Company } from "./company/Company";

export interface CurriculumVitae {
    id: string;
    companiesIds: string[];
    educationIds: string[];
    skillsIds: string[];
    projectsIds: string[];
    companies: Company[];
    // education: Education[];
    // skills: Skill[];
    // projects: Project[];
}