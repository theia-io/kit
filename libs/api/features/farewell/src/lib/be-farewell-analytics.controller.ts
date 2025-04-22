import { FarewellAnalytics as IFarewellAnalytics } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BeFarewellAnalyticsService } from './be-farewell-analytics.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('farewell-analytics')
export class BeFarewellAnalyticsController {
  constructor(private beFarewellAnalyticsService: BeFarewellAnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsFarewells(@Query('farewellIds') farewellIds: string) {
    const farewellIdsArray = farewellIds.split(',');
    return this.beFarewellAnalyticsService.getAnalyticsFarewells(
      farewellIdsArray
    );
  }

  @Get(':farewellId')
  
  async getAnalyticsFarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellAnalyticsService.getAnalyticsFarewell(farewellId);
  }

  @Post()

  async createAnalyticsfarewell(@Body() farewellAnalytics: IFarewellAnalytics) {
    return this.beFarewellAnalyticsService.createAnalyticsfarewell(
      farewellAnalytics
    );
  }

  @Delete(':farewellId')
  
  async deletefarewellAnalytics(@Param('farewellid') farewellId: string) {
    return this.beFarewellAnalyticsService.deleteFarewellAnalytics(farewellId);
  }
}
