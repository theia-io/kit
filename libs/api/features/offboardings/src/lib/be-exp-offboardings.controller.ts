import { OptionalJwtAuthGuard } from '@kitouch/be-auth';
import {
  Auth0Kit,
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

@Controller('offboardings')
export class BeExpOffboardingsController {
  constructor(private beExpOffboardingsService: BeExpOffboardingsService) {}

  @Get('profile/:profileId')
  @UseGuards(AuthGuard('jwt'))
  async getProfileOffboardings(@Param('profileId') profileId: string) {
    return this.beExpOffboardingsService.getProfileOffboardings(profileId);
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
