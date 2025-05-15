import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Extend the standard JWT AuthGuard

  // Override the handleRequest method
  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    // err: Error if validation failed (e.g., invalid signature, expired)
    // user: The payload returned from your JwtStrategy.validate() method IF successful, otherwise false/null/undefined
    // info: Extra info (e.g., error message like 'No auth token')
    // context: Execution context
    // status: Status (rarely used)

    // Instead of throwing an error if 'err' exists or 'user' is falsey,
    // we simply return the user object (which might be null/undefined if auth failed).
    // The route handler will then execute regardless, but req.user will only be populated if auth succeeded.
    return user;
  }
}
