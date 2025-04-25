import { Module } from '@nestjs/common';

import { AuthModule } from '@kitouch/be-auth';
import { BeBookmarksModule } from '@kitouch/be-bookmarks';
import { ConfigModule } from '@kitouch/be-config';
import { DbModule } from '@kitouch/be-db';
import { KitModule } from '@kitouch/be-kit';
import { MediaModule } from '@kitouch/be-media';
import { BeTweetModule } from '@kitouch/be-tweet';
import { InfraModule } from '@kitouch/infra';
import { TerminusModule } from '@nestjs/terminus';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './heath.controller';
import { BeKudoboardModule } from '@kitouch/be-kudoboard';
import { BeFarewellModule } from '@kitouch/be-farewell';
import { AWSModule } from '@kitouch/aws';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot(environment),
    AWSModule,
    InfraModule,
    MediaModule,
    AuthModule,
    /** DB-related info */
    DbModule,
    KitModule, // accounts, profiles, users
    BeTweetModule,
    BeBookmarksModule,
    BeFarewellModule,
    BeKudoboardModule,
  ],
  controllers: [HealthController, AppController],
  providers: [AppService],
})
export class AppModule {}
