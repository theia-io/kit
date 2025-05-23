import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './be-media.controller';
import { MediaService } from './be-media.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Or another storage location
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
