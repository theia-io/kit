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
import { DbModule } from '@kitouch/be-db';
import { KitModule } from '@kitouch/be-kit';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot(environment),
    InfraModule,
    MediaModule,
    AuthModule,
    /** DB-related info */
    DbModule,
    KitModule,
  ],
  controllers: [HealthController, AppController],
  providers: [AppService],
})
export class AppModule {}
