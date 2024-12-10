import { S3Module } from '@kitouch/s3';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    S3Module,
    MulterModule.register({
      dest: './uploads', // Or another storage location
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
