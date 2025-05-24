import { Auth0Kit, KudoBoard as IKudoBoard } from '@kitouch/shared-models';
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
import { BeKudoboardService } from './be-kudoboard.service';
import { OptionalJwtAuthGuard } from '@kitouch/be-auth';

@Controller('kudoboards')
export class BeKudoboardController {
  constructor(private beKudoboardService: BeKudoboardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  // todo take profileid from req.user
  async getProfileKudoboards(@Query('profileId') profileId: string) {
    return this.beKudoboardService.getProfileKudoboards(profileId);
  }

  @Get(':kudoboardId')
  @UseGuards(OptionalJwtAuthGuard)
  async getKudoboard(
    @Req() req: Request,
    @Param('kudoboardId') kudoboardId: string
  ) {
    const currentProfileIds =
      (req.user as Auth0Kit).profiles?.map((profile) => profile.id) ?? [];

    return this.beKudoboardService.getKudoboard(kudoboardId, currentProfileIds);
  }

  @Post()
  async createKudoboard(@Body() kudoBoard: IKudoBoard) {
    return this.beKudoboardService.createKudoboard(kudoBoard);
  }

  @Put(':kudoboardId')
  async updateKudoboard(
    @Param('kudoboardId') kudoboardId: string,
    @Body() kudoBoard: IKudoBoard
  ) {
    return this.beKudoboardService.updateKudoboard(kudoboardId, kudoBoard);
  }

  @Delete(':kudoboardId')
  @UseGuards(AuthGuard('jwt'))
  async deleteKudoboard(@Param('kudoboardId') kudoboardId: string) {
    return this.beKudoboardService.deleteKudoboard(kudoboardId);
  }
}
