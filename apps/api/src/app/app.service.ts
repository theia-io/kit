import { ConfigService } from '@kitouch/be-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getData() {
    return {
      message: `API time: ${new Date().toUTCString()}`,
      environment: JSON.stringify(this.configService.getEnvironment()),
    };
  }
}
