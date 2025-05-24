import { OptionalJwtAuthGuard } from '@kitouch/be-auth';
import {
  Auth0Kit,
  ExpOffboardingAnalytics,
  ExpOffboarding as IExpOffboarding,
} from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';

@Controller('be-exp-offboardings')
export class BeExpOffboardingsController {
  constructor(private beExpOffboardingsService: BeExpOffboardingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileOffboardings(@Req() req: Request) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beExpOffboardingsService.getProfileOffboardings(
      currentProfileIds[0]
    );
  }

  @Get(':offboardingId')
  @UseGuards(OptionalJwtAuthGuard)
  async getOffboarding(
    @Req() req: Request,
    @Param('offboardingId') offboardingId: string
  ) {
    const currentProfileIds =
      (req.user as Auth0Kit).profiles?.map((profile) => profile.id) ?? [];

    return this.beExpOffboardingsService.getOffboarding(
      offboardingId,
      currentProfileIds
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOffboarding(@Body() Offboarding: IExpOffboarding) {
    return this.beExpOffboardingsService.createOffboarding(Offboarding);
  }

  @Put(':offboardingId')
  @UseGuards(AuthGuard('jwt'))
  async updateOffboarding(
    @Req() req: Request,
    @Param('offboardingId') offboardingId: string,
    @Body() offboarding: IExpOffboarding
  ) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beExpOffboardingsService.updateOffboarding(
      offboardingId,
      offboarding,
      currentProfileIds
    );
  }

  @Post('analytics/:offboardingId')
  @UseGuards(OptionalJwtAuthGuard)
  async createAnalyticsOffboarding(
    @Param('offboardingId') offboardingId: string,
    @Body() offboarding: ExpOffboardingAnalytics
  ) {
    return this.beExpOffboardingsService.createAnalyticsOffboarding(
      offboardingId,
      offboarding
    );
  }

  @Delete(':offboardingId')
  @UseGuards(AuthGuard('jwt'))
  async deleteOffboarding(
    @Req() req: Request,
    @Param('offboardingId') offboardingId: string
  ) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beExpOffboardingsService.deleteOffboarding(
      offboardingId,
      currentProfileIds
    );
  }
}
