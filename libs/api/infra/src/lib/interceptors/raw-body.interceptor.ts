import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import getRawBody from 'raw-body';
import { Observable } from 'rxjs';

@Injectable()
export class RawBodyInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    req.body = await getRawBody(req);

    return next.handle();
  }
}
