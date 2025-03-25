export interface User {
  email: string;
  name: string;
  surname: string;
  picture: string;
}

// Augment the Express Request interface
declare namespace Express {
  export interface Request {
    user?: User; // Define the user property, make it optional '?' if it might not always exist
    oidc?: any; // You might also want to declare the oidc property added by express-openid-connect
  }
}
