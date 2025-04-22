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
  async getFarewell(@Param('farewellId') farewellId: string) {
    return this.beFarewellService.getFarewell(farewellId);
  }

  @Post()
  async createFarewell(@Body() farewell: IFarewell) {
    return this.beFarewellService.createFarewell(farewell);
  }

  @Put(':farewellId')
  async updateFarewell(
    @Param('farewellId') farewellId: string,
    @Body() farewell: IFarewell
  ) {
    console.log('updateFarewell', farewellId, farewell);
    return this.beFarewellService.updateFarewell(farewellId, farewell);
  }

  @Delete(':farewellId')
  async deleteFarewell(@Param('farewellId') farewellId: string) {
    console.log('deleteFarewell', farewellId);
    return this.beFarewellService.deleteFarewell(farewellId);
  }
}
