import { Module } from '@nestjs/common';
import { RawBodyInterceptor } from './interceptors/raw-body.interceptor';

@Module({
  controllers: [],
  providers: [RawBodyInterceptor],
  exports: [RawBodyInterceptor],
})
export class InfraModule {}
