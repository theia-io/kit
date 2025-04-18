import { Module, Global } from '@nestjs/common';
import { BeKudoboardController } from './be-kudoboard.controller';
import { BeKudoboardService } from './be-kudoboard.service';

@Global()
@Module({
  controllers: [BeKudoboardController],
  providers: [BeKudoboardService],
  exports: [BeKudoboardService],
})
export class BeKudoboardModule {}
