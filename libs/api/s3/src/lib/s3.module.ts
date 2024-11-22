import { Module } from '@nestjs/common';
import { S3ApiService } from './s3-api.service';

@Module({
  controllers: [],
  providers: [S3ApiService],
  exports: [S3ApiService],
})
export class S3Module {}
