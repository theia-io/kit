import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { MediaModule } from '@kitouch/be-media';

@Module({
  imports: [ConfigModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
