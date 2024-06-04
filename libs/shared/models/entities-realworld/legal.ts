import { CustomerInfo } from "./shared";

export enum LegalType {
  Private = 'Private',
  Company = 'Company',
  LLC = 'LLC',
  Limited = 'Limited',
  Charity = 'Charity',
  NonProfit = 'NonProfit',
}

export enum BusinessType {
  Outsource = 'Outsource',
  Outstaff = 'Outstaff',
  Employ = 'Employ',
}

// User has to be replaced with Physical person and Company to Legal entity.
export interface Legal {
  // id
  accountId: string;
  // business
  type: LegalType;
  businessType: BusinessType;
  name: string;
  description: string;
  sector: string; // IT/Agri
  registration: string; // and link and eetc
  logo: string;
  website: string;
  // meta
  customerInfo: CustomerInfo;
}