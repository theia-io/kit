import { Module } from '@nestjs/common';

import { AuthModule } from '@kitouch/be-auth';
import { ConfigModule } from '@kitouch/be-config';
import { MediaModule } from '@kitouch/be-media';
import { InfraModule } from '@kitouch/infra';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './heath.controller';
import { environment } from '../environments/environment';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.register(environment),
    InfraModule,
    MediaModule,
    AuthModule,
  ],
  controllers: [HealthController, AppController],
  providers: [AppService],
})
export class AppModule {}
