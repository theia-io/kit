import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeExpOffboardingsController } from './be-exp-offboardings.controller';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';
import { ExpOffboarding, ExpOffboardingSchema } from './schemas';

@Global()
@Module({
  controllers: [BeExpOffboardingsController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ExpOffboarding.name,
        useFactory: () => ExpOffboardingSchema,
      },
    ]),
  ],
  providers: [BeExpOffboardingsService],
  exports: [BeExpOffboardingsService],
})
export class BeExpOffboardingsModule {}
