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
import { BeFarewellService } from './be-farewell.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('farewells')
export class BeFarewellController {
  constructor(private beFarewellService: BeFarewellService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileFarewells(@Query('profileId') profileId: string) {
    return this.beFarewellService.getProfileFarewells(profileId);
  }

  @Get(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async getfarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellService.getFarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createfarewell(@Body() Farewell: IFarewell) {
    console.log('createFarewell', Farewell);
    return this.beFarewellService.createFarewell(Farewell);
  }

  @Put(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async updatefarewell(
    @Param('farewellId') farewellId: string,
    @Body() farewell: IFarewell
  ) {
    console.log('updateFarewell', farewellId, farewell);
    return this.beFarewellService.updateFarewell(farewellId, farewell);
  }
  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deletefarewell(@Param('farewellId') farewellId: string) {
    console.log('deleteFarewell', farewellId);
    return this.beFarewellService.deleteFarewell(farewellId);
  }
}
