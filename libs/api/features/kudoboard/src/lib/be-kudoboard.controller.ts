import { KudoBoard as IKudoBoard } from '@kitouch/shared-models';
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
import { AuthGuard } from '@nestjs/passport';
import { BeKudoboardService } from './be-kudoboard.service';

@Controller('kudoboards')
export class BeKudoboardController {
  constructor(private beKudoboardService: BeKudoboardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileKudoboards(@Query('profileId') profileId: string) {
    return this.beKudoboardService.getProfileKudoboards(profileId);
  }

  @Get(':kudoboardId')
  @UseGuards(AuthGuard('jwt'))
  async getKudoboard(@Param('kudoboardId') kudoboardId: string) {
    return this.beKudoboardService.getKudoboard(kudoboardId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createKudoboard(@Body() kudoBoard: IKudoBoard) {
    console.log('createKudoboard', kudoBoard);
    return this.beKudoboardService.createKudoboard(kudoBoard);
  }

  @Put(':kudoboardId')
  @UseGuards(AuthGuard('jwt'))
  async updateKudoboard(
    @Param('kudoboardId') kudoboardId: string,
    @Body() kudoBoard: IKudoBoard
  ) {
    console.log('updateKudoboard', kudoboardId, kudoBoard);
    return this.beKudoboardService.updateKudoboard(kudoboardId, kudoBoard);
  }

  @Delete(':kudoboardId')
  @UseGuards(AuthGuard('jwt'))
  async deleteKudoboard(@Param() kudoboardId: string) {
    console.log('deleteKudoboard', kudoboardId);
    return this.beKudoboardService.deleteKudoboard(kudoboardId);
  }
}
