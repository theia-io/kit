import { Injectable } from '@nestjs/common';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  getData() {
    return {
      message: `Hello API, deployed at: ${new Date().toUTCString()}`,
      version: environment.version,
      apiBase: environment.apiBase,
    };
  }
}
