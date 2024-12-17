import { Injectable } from '@nestjs/common';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return {
      message: `Hello API, deployed at: ${new Date().toUTCString()}. \nENVS: 
        \n- version - ${environment.version}, 
        \n- api base - ${environment.apiBase}`,
    };
  }
}
