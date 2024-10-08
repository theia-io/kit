import { CustomerInfo } from './shared';

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
  id: string;
  alias: string; // unique to
  /**
   * @TODO Implement accountId linking - or ids
   * when users become an admins to a legal entities
   * e.g. those who are currently working there? Or by vote? Or?
   */
  // accountId: string;
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
