import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeFarewellCommentsController } from './be-farewell-comments.controller';
import { BeFarewellCommentsService } from './be-farewell-comments.service';
import { BeFarewellController } from './be-farewell.controller';
import { BeFarewellService } from './be-farewell.service';
import { Farewell, FarewellSchema } from './schemas';
import {
  FarewellAnalytics,
  FarewellAnalyticsSchema,
} from './schemas/farewell-analytics.schema';
import {
  FarewellComments,
  FarewellCommentsSchema,
} from './schemas/farewell-comments.schema';
import {
  FarewellReactions,
  FarewellReactionsSchema,
} from './schemas/farewell-reaction.schema';
import { BeFarewellAnalyticsController } from './be-farewell-analytics.controller';
import { BeFarewellAnalyticsService } from './be-farewell-analytics.service';
import { BeFarewellReactionsController } from './be-farewell-reactions.controller';
import { BeFarewellReactionsService } from './be-farewell-reactions.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Farewell.name,
        useFactory: () => FarewellSchema,
      },
      {
        name: FarewellComments.name,
        useFactory: () => FarewellCommentsSchema,
      },
      {
        name: FarewellReactions.name,
        useFactory: () => FarewellReactionsSchema,
      },
      {
        name: FarewellAnalytics.name,
        useFactory: () => FarewellAnalyticsSchema,
      },
    ]),
  ],
  controllers: [
    BeFarewellController,
    BeFarewellCommentsController,
    BeFarewellReactionsController,
    BeFarewellAnalyticsController,
  ],
  providers: [
    BeFarewellService,
    BeFarewellCommentsService,
    BeFarewellReactionsService,
    BeFarewellAnalyticsService,
  ],
})
export class BeFarewellModule {}
