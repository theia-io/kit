import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeKudoBoardAnalyticsController } from './be-kudoboard-analytics.controller';
import { BeKudoBoardAnalyticsService } from './be-kudoboard-analytics.service';
import { BeKudoBoardCommentsController } from './be-kudoboard-comments.controller';
import { BeKudoBoardCommentsService } from './be-kudoboard-comments.service';
import { BeKudoBoardReactionsController } from './be-kudoboard-reactions.controller';
import { BeKudoBoardReactionsService } from './be-kudoboard-reactions.service';
import { BeKudoboardController } from './be-kudoboard.controller';
import { BeKudoboardService } from './be-kudoboard.service';
import { KudoBoard, KudoBoardSchema } from './schemas';
import {
  KudoBoardAnalytics,
  KudoBoardAnalyticsSchema,
} from './schemas/kudoboard-analytics.schema';
import {
  KudoBoardComments,
  KudoBoardCommentsSchema,
} from './schemas/kudoboard-comments.schema';
import {
  KudoBoardReactions,
  KudoBoardReactionsSchema,
} from './schemas/kudoboard-reaction.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: KudoBoard.name,
        useFactory: () => KudoBoardSchema,
      },
      {
        name: KudoBoardComments.name,
        useFactory: () => KudoBoardCommentsSchema,
      },
      {
        name: KudoBoardReactions.name,
        useFactory: () => KudoBoardReactionsSchema,
      },
      {
        name: KudoBoardAnalytics.name,
        useFactory: () => KudoBoardAnalyticsSchema,
      },
    ]),
  ],
  controllers: [
    BeKudoboardController,
    BeKudoBoardAnalyticsController,
    BeKudoBoardCommentsController,
    BeKudoBoardReactionsController,
  ],
  providers: [
    BeKudoboardService,
    BeKudoBoardAnalyticsService,
    BeKudoBoardCommentsService,
    BeKudoBoardReactionsService,
  ],
})
export class BeKudoboardModule {}
