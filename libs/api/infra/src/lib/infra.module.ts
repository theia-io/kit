import { Module } from '@nestjs/common';
import { LoggingInterceptor, RawBodyInterceptor } from './interceptors';

@Module({
  controllers: [],
  providers: [RawBodyInterceptor, LoggingInterceptor],
  exports: [RawBodyInterceptor, LoggingInterceptor],
})
export class InfraModule {}
