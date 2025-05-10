import { Auth0Kit } from '@kitouch/shared-models';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP'); // Logger context

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>(); // Get Express Request object
    // const response = httpContext.getResponse<Response>();
    const method = request.method;
    const url = request.originalUrl || request.url; // Use originalUrl for full path
    // const now = Date.now();

    // It will be populated IF AuthGuard('jwt') or OptionalJwtAuthGuard ran successfully before this interceptor
    const authKit = (request as any).user as Auth0Kit | undefined;
    const { account, user, profiles, email } = authKit ?? {};

    // Log incoming request details (including user if available)
    this.logger.log(
      `[Request] ${method} ${url} - account id: ${
        account?.id || 'N/A'
      } User id: ${user?.id || 'N/A'}, profile id ${
        profiles?.[0]?.id
      }, email: ${email || 'N/A'}, IP: ${request.ip}`
    );

    // Continue the request pipeline
    return next
      .handle()
      .pipe
      //   tap((data) => {
      //     // Log outgoing response details
      //     this.logger.log(
      //       `[Response] ${method} ${url} ${response.statusCode} - ${
      //         Date.now() - now
      //       }ms - profile id: ${profiles?.[0]?.id || 'N/A'}`
      //     );
      //   })
      //   // Add error handling if needed
      //   // catchError(err => { ... })
      ();
  }
}
