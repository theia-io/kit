import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FarewellAnalytics,
  FarewellAnalyticsDocument,
} from './schemas/farewell-analytics.schema';

@Injectable()
export class BeFarewellAnalyticsService {
  constructor(
    @InjectModel(FarewellAnalytics.name)
    private farewellAnalyticsModel: Model<FarewellAnalyticsDocument>
  ) {}
}
