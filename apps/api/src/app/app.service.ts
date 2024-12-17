import { Injectable } from '@nestjs/common';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return {
      message: `Hello API 7: ${environment.version}, ${environment.apiBase}`,
    };
  }
}
