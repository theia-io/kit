import { Auth0Kit, ExpOffboardingAnalytics } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeOffboardingAnalyticsService } from './be-offboardings-analytics.service';

@Controller('offboarding-analytics')
export class BeOffboardingAnalyticsController {
  constructor(
    private beOffboardingAnalyticsService: BeOffboardingAnalyticsService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAnalyticsOffboardings(
    @Query('offboardingIds') offboardingIds: string
  ) {
    const offboardingIdsArray = offboardingIds.split(',');
    return this.beOffboardingAnalyticsService.getAnalyticsOffboardings(
      offboardingIdsArray
    );
  }

  @Get(':kudoBoardId')
  async getAnalyticsKudoBoard(@Param('kudoBoardId') kudoBoardId: string) {
    return this.beOffboardingAnalyticsService.getAnalyticsOffboarding(
      kudoBoardId
    );
  }

  @Post()
  async createAnalyticsOffboarding(
    @Body() offboarding: ExpOffboardingAnalytics
  ) {
    return this.beOffboardingAnalyticsService.createAnalyticsOffboarding(
      offboarding
    );
  }

  @Delete(':offboardingId')
  @UseGuards(AuthGuard('jwt'))
  async deleteOffboardingAnalytics(
    @Req() req: Request,
    @Param('offboardingId') offboardingId: string
  ) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beOffboardingAnalyticsService.deleteOffboardingAnalytics(
      offboardingId,
      currentProfileIds
    );
  }
}
