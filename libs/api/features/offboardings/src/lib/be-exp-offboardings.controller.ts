import { Auth0Kit } from '@kitouch/shared-models';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';
import { OptionalJwtAuthGuard } from '@kitouch/be-auth';

@Controller('be-exp-offboardings')
export class BeExpOffboardingsController {
  constructor(private beExpOffboardingsService: BeExpOffboardingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileKudoboards(@Req() req: Request) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beExpOffboardingsService.getProfileOffboardings(
      currentProfileIds[0]
    );
  }

  @Get(':offboardingId')
  @UseGuards(OptionalJwtAuthGuard)
  async getKudoboard(
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
}
