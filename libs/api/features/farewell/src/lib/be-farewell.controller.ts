import { Auth0Kit, Farewell as IFarewell } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeFarewellService } from './be-farewell.service';

@Controller('farewells')
export class BeFarewellController {
  constructor(private beFarewellService: BeFarewellService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileFarewells(@Query('profileId') profileId: string) {
    return this.beFarewellService.getProfileFarewells(profileId);
  }

  @Get(':farewellId')
  async getFarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellService.getFarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createFarewell(@Body() farewell: IFarewell) {
    return this.beFarewellService.createFarewell(farewell);
  }

  @Put(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async updateFarewell(
    @Req() req: Request,
    @Param('farewellId') farewellId: string,
    @Body() farewell: Omit<IFarewell, 'id'>
  ) {
    const currentProfileIds = (req.user as Auth0Kit).profiles.map(
      (profile) => profile.id
    );

    return this.beFarewellService.updateFarewell(
      farewellId,
      farewell,
      currentProfileIds
    );
  }

  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deleteFarewell(
    @Req() req: Request,
    @Param('farewellId') farewellId: string
  ) {
    const currentProfileIds = (req.user as Auth0Kit).profiles.map(
      (profile) => profile.id
    );

    return this.beFarewellService.deleteFarewell(farewellId, currentProfileIds);
  }
}
