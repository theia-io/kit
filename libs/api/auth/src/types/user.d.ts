export interface User {
  email: string;
  name: string;
  surname: string;
  picture: string;
  email_verified: boolean;
}

// Augment the Express Request interface
declare namespace Express {
  export interface Request {
    user?: User; // Define the user property, make it optional '?' if it might not always exist
  }
}
