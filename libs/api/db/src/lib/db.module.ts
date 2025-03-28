import { Module } from '@nestjs/common';
import { DBService } from './db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DBService],
  exports: [DBService],
})
export class DbModule {}
