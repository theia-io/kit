import { Global, Module } from '@nestjs/common';
import { S3ApiService } from './s3-api.service';
import { AWSSecretsService } from './secrets.service';

@Global()
@Module({
  controllers: [],
  providers: [S3ApiService, AWSSecretsService],
  exports: [S3ApiService, AWSSecretsService],
})
export class AWSModule {}
