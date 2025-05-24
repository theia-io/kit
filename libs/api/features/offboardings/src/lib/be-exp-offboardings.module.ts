import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeExpOffboardingsController } from './be-exp-offboardings.controller';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';
import { ExpOffboarding, ExpOffboardingSchema } from './schemas';
import {
  ExpOffboardingAnalytics,
  ExpOffboardingAnalyticsSchema,
} from './schemas/offboarding-analytics.schema';

@Global()
@Module({
  controllers: [BeExpOffboardingsController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ExpOffboarding.name,
        useFactory: () => ExpOffboardingSchema,
      },
      {
        name: ExpOffboardingAnalytics.name,
        useFactory: () => ExpOffboardingAnalyticsSchema,
      },
    ]),
  ],
  providers: [BeExpOffboardingsService],
  exports: [BeExpOffboardingsService],
})
export class BeExpOffboardingsModule {}
