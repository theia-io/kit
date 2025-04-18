import { Controller } from '@nestjs/common';
import { BeFarewellAnalyticsService } from './be-farewell-analytics.service';

@Controller('farewell-analytics')
export class BeFarewellAnalyticsController {
  constructor(private beFarewellService: BeFarewellAnalyticsService) {}
}
