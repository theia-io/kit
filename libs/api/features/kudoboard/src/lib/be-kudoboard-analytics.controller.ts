import { KudoBoardAnalytics } from '@kitouch/shared-models';
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
import { AuthGuard } from '@nestjs/passport';
import { BeKudoBoardAnalyticsService } from './be-kudoboard-analytics.service';

@Controller('kudoboard-analytics')
export class BeKudoBoardAnalyticsController {
  constructor(
    private beKudoBoardAnalyticsService: BeKudoBoardAnalyticsService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsKudoBoards(@Query('kudoBoardIds') kudoBoardIds: string) {
    const kudoBoardIdsArray = kudoBoardIds.split(',');
    return this.beKudoBoardAnalyticsService.getAnalyticsKudoBoards(
      kudoBoardIdsArray
    );
  }

  @Get(':kudoBoardId')
  async getAnalyticsKudoBoard(@Param('kudoBoardId') kudoBoardId: string) {
    return this.beKudoBoardAnalyticsService.getAnalyticsKudoBoard(kudoBoardId);
  }

  @Post()
  async createAnalyticsKudoBoard(
    @Body() kudoBoardAnalytics: KudoBoardAnalytics
  ) {
    return this.beKudoBoardAnalyticsService.createAnalyticsKudoBoard(
      kudoBoardAnalytics
    );
  }

  @Delete(':kudoboardId')
  @UseGuards(AuthGuard('jwt'))
  async deleteKudoboardAnalytics(@Param('kudoboardId') kudoboardId: string) {
    return this.beKudoBoardAnalyticsService.deleteKudoboardAnalytics(
      kudoboardId
    );
  }
}
