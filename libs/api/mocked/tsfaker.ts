export interface Account {
    // keys
    id: number;
    settingIds: string;
    // meta
    type: 'admin' | 'user' | 'group';
    status: 'active' | 'inactive' | 'blocked' | 'deleted';
    password: string;
    services: [];
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
  }
  
  export interface CustomerInfo {
    contact: {
      alias: string;
      isPrimary: boolean;
      //
      email: string;
      phone: string;
      fax: string;
      address: string;
      website: string;
    };
    birthday: Date;
    
      exp1title: DataType.USER_NAME;
      exp1description: DataType.DESCRIPTION;
      exp1image: string;
      exp1link: string;
      title: DataType.USER_NAME;
      description: DataType.DESCRIPTION;
      image: string;
      link: string;
    location: string;
  }
  
  export interface User {
    accountId: number;
    profileId: Profile['id'];
    //];
    roles: Array<'admin' | 'user'>;
    //
    name: DataType.FIRST_NAME;
    surname: DataType.LAST_NAME;
    middleName: string;
    gender: Gender; // ids?
    lanname: DataType.FIRST_NAME;
      lancode: string;
      lanisPrimary?: boolean;
    eduname: DataType.FIRST_NAME;
      edulevel: string;
      edustart: number;
      eduurl: string;
      eduend: number;
     cername: DataType.FIRST_NAME;
      cerlevel: string;
      cerstart: number;
      cerurl: string;
      cerend: number;
    cvs: Array<{
      id: number;
      educations: {
        name: DataType.FIRST_NAME;
        level: string;
        start: number;
        url: string;
        end: number;
      }[];
      skills: {
        name: DataType.FIRST_NAME;
        level: string;
      }[];
      projects: {
        name: DataType.FIRST_NAME;
        description: DataType.DESCRIPTION;
        image: string;
        link: string;
      }[];
      companies: {
        accountId: string;
        profileId: string;
        //
        name: DataType.FIRST_NAME;
        description: DataType.DESCRIPTION;
        businessType: string;
        sector: string; // IT/Agri
        type: string; // outsource / outstaff / employ
        registration: string; // and link and eetc
        //
        logo: string;
        website: string;
        //
        customerInfo: {
          contact: {
            alias: string;
            isPrimary: boolean;
            //
            email: string;
            phone: string;
            fax: string;
            address: string;
            website: string;
          };
          birthday: Date;
          experience: Array<{
            title: DataType.USER_NAME;
            description: DataType.DESCRIPTION;
            image: string;
            link: string;
          }>;
          location: string;
        };
      }[];
    }>;
    skills: {
      name: DataType.FIRST_NAME;
      level: string;
    }[]; // ids?
    projects: {
      name: DataType.FIRST_NAME;
      description: DataType.DESCRIPTION;
      image: string;
      link: string;
    }[]; // ids?
    companies: {
      accountId: string;
      profileId: string;
      //
      name: DataType.FIRST_NAME;
      description: DataType.DESCRIPTION;
      businessType: string;
      sector: string; // IT/Agri
      type: string; // outsource / outstaff / employ
      registration: string; // and link and eetc
      //
      logo: string;
      website: string;
      //
      customerInfo: {
        contact: {
          alias: string;
          isPrimary: boolean;
          //
          email: string;
          phone: string;
          fax: string;
          address: string;
          website: string;
        };
        birthday: Date;
        experience: Array<{
          title: DataType.USER_NAME;
          description: DataType.DESCRIPTION;
          image: string;
          link: string;
        }>;
        location: string;
      };
    }[]; // ids?
    //
    customerInfo: {
      contact: {
        alias: string;
        isPrimary: boolean;
        //
        email: string;
        phone: string;
        fax: string;
        address: string;
        website: string;
      };
      birthday: Date;
      experience: Array<{
        title: DataType.USER_NAME;
        description: DataType.DESCRIPTION;
        image: string;
        link: string;
      }>;
      location: string;
    };
    privateFields: keyof User;
  }
  
  export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    NOANSWER = 'noanswer',
  }
  
  export enum ProfileType {
    Personal = 'Personal',
    Professional = 'Professional',
  }
  
  export interface Profile {
    id: number;
    name: DataType.FIRST_NAME; // either this or id will be resolved as page
    type: ProfileType;
    // own
    title: DataType.USER_NAME;
    subtitle: string;
    description: DataType.DESCRIPTION;
    pictures: Array<{
      id: number;
      url: string;
      isPrimary?: boolean;
    }>;
    links: {
      name: string;
      url: string;
    }[];
    // meta
    followers: string[]; // Profiles
    following: string[]; // Profiles
  }
  