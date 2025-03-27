import { Auth0User } from '@kitouch/shared-models';

// Augment the Express Request interface
declare namespace Express {
  export interface Request {
    user?: Auth0User; // Define the user property, make it optional '?' if it might not always exist
  }
}
