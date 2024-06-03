import { CustomerInfo } from "./shared";

export interface Company {
  accountId: string;
  profileId: string;
  // 
  name: string;
  description: string;
  businessType: string;
  sector: string; // IT/Agri
  type: string; // outsource / outstaff / employ
  registration: string; // and link and eetc
  //
  logo: string;
  website: string;
  // 
  customerInfo: CustomerInfo;
}