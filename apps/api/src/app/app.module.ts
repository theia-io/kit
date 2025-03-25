import { Module } from '@nestjs/common';

import { MediaModule } from '@kitouch/be-media';
import { InfraModule } from '@kitouch/infra';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { HealthController } from './heath.controller';
import { AuthModule } from '@kitouch/be-auth';

@Module({
  imports: [TerminusModule, ConfigModule, InfraModule, MediaModule, AuthModule],
  controllers: [HealthController, AppController],
  providers: [AppService],
})
export class AppModule {}
