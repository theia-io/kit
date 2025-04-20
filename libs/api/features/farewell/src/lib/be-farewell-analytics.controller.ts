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
  beFarewellAnalyticsService: any;
  constructor(private beFarewellService: BeFarewellAnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsfarewell(@Query('kudoBoardIds') farewellIds: string) {
    const farewellIdsArray = farewellIds.split(',');
    return this.beFarewellAnalyticsService.getAnalyticsKudoBoards(
      farewellIdsArray
    );
  }

  @Get(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsKudoBoard(@Param('farewellId') farewellId: string) {
    return this.beFarewellAnalyticsService.getAnalyticsfarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAnalyticsfarewell(@Body() farewellAnalytics: FarewellAnalytics) {
    return this.beFarewellAnalyticsService.createAnalyticsfarewell(
      farewellAnalytics
    );
  }

  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deletefarewellAnalytics(@Param('farewellid') farewellId: string) {
    return this.beFarewellAnalyticsService.deletefarewellAnalytics(farewellId);
  }
}
