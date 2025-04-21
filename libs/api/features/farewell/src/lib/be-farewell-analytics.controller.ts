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
import { FarewellAnalytics } from './schemas/farewell-analytics.schema';
import { AuthGuard } from '@nestjs/passport';
@Controller('farewell-analytics')
export class BeFarewellAnalyticsController {
  constructor(private beFarewellAnalyticsService: BeFarewellAnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsfarewell(@Query('farewellIds') farewellIds: string) {
    const farewellIdsArray = farewellIds.split(',');
    return this.beFarewellAnalyticsService.getAnalyticsFarewells(
      farewellIdsArray
    );
  }

  @Get(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsKudoBoard(@Param('farewellId') farewellId: string) {
    return this.beFarewellAnalyticsService.getAnalyticsFarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAnalyticsfarewell(@Body() farewellAnalytics: IFarewellAnalytics) {
    return this.beFarewellAnalyticsService.createAnalyticsfarewell(
      farewellAnalytics
    );
  }

  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deletefarewellAnalytics(@Param('farewellid') farewellId: string) {
    return this.beFarewellAnalyticsService.deleteFarewellAnalytics(farewellId);
  }
}
