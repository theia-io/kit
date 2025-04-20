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

@Controller('farewell')
export class BeFarewellController {
  constructor(private beFarewellService: BeFarewellService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileFarewells(@Query('profileId') profileId: string) {
    console.log('getProfileFarewells', profileId);
    return this.beFarewellService.getProfileFarewells(profileId);
  }

  @Get(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async getfarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellService.getfarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createfarewell(@Body() Farewell: IFarewell) {
    console.log('createFarewell', Farewell);
    return this.beFarewellService.createfarewell(Farewell);
  }

  @Put(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async updatefarewell(
    @Param('farewellId') farewellId: string,
    @Body() farewell: IFarewell
  ) {
    console.log('updateFarewell', farewellId, farewell);
    return this.beFarewellService.updatefarewell(farewellId, farewell);
  }
  @Delete(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async deletefarewell(@Param('farewellId') farewellId: string) {
    console.log('deleteFarewell', farewellId);
    return this.beFarewellService.deletefarewell(farewellId);
  }
}
