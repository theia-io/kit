import { Module } from '@nestjs/common';

import { MediaModule } from '@kitouch/be-media';
import { InfraModule } from '@kitouch/infra';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';

@Module({
  imports: [ConfigModule, InfraModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
