import { Farewell as IFarewell } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BeFarewellAnalyticsService } from './be-farewell-analytics.service';

@Controller('farewell-analytics')
export class BeFarewellAnalyticsController {
  constructor(private beFarewellAnalyticsService: BeFarewellAnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsFarewells(@Query('farewellIds') farewellIds: string) {
    const farewellIdsArray = farewellIds.split(',');
    return this.beFarewellAnalyticsService.getAnalyticFarewells(
      farewellIdsArray,
    );
  }

  @Get(':farewellId')
  async getAnalyticsFarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellAnalyticsService.getAnalyticFarewell(farewellId);
  }

  @Post()
  async createAnalyticsFarewell(@Body() farewell: IFarewell) {
    return this.beFarewellAnalyticsService.createAnalyticsFarewell(farewell);
  }

  @Put(':analyticId')
  async updateFarewellAnalytics(
    @Param('analyticId') analyticId: string,
    @Body() farewell: IFarewell,
  ) {
    return this.beFarewellAnalyticsService.updateAnalyticsFarewell(
      analyticId,
      farewell,
    );
  }

  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deleteFarewellAnalytics(@Param('farewellId') farewellId: string) {
    return this.beFarewellAnalyticsService.deleteFarewellAnalytics(farewellId);
  }
}
