import { Injectable } from '@nestjs/common';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  getData() {
    return {
      message: `\nAPI time: ${new Date().toUTCString()};\nAPI deployed at ${
        environment.date
      }`,
      version: environment.version,
      apiBase: environment.apiBase,
    };
  }
}
