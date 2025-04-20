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
    return this.beFarewellService.getProfilefarewell(profileId);
  }
  @Get(':FarewellId')
  @UseGuards(AuthGuard('jwt'))
  async getfarewell(@Param('FarewellId') FarewellId: string) {
    return this.beFarewellService.getfarewell(FarewellId);
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
    @Param('farewellId') FarewellId: string,
    @Body() Farewell: IFarewell
  ) {
    console.log('updateFarewell', FarewellId, Farewell);
    return this.beFarewellService.updatefarewell(FarewellId, Farewell);
  }
  @Delete(':FarewellId')
  @UseGuards(AuthGuard('jwt'))
  async deletefarewell(@Param('FarewellId') FarewellId: string) {
    console.log('deleteFarewell', FarewellId);
    return this.beFarewellService.deletefarewell(FarewellId);
  }
}
