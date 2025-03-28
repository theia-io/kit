import { Module } from '@nestjs/common';
import { KitController } from './kit.controller';

@Module({
  // imports: [DbModule],
  controllers: [KitController],
  providers: [],
  exports: [],
})
export class KitModule {}
