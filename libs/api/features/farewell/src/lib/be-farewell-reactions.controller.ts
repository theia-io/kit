import { Auth0Kit, FarewellReaction } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { BeFarewellReactionsService } from './be-farewell-reactions.service';

@Controller('farewell-reactions')
export class BeFarewellReactionsController {
  constructor(private beFarewellReactionsService: BeFarewellReactionsService) {}

  @Get(':farewellId')
  async getReactionsFarewell(@Param('farewellId') farewellId: string) {
    if (!farewellId) {
      throw new HttpException('farewellId is required', HttpStatus.BAD_REQUEST);
    }

    return this.beFarewellReactionsService.getReactionsFarewell(farewellId);
  }

  @Post()
  async createReactionsFarewell(@Body() farewellReaction: FarewellReaction) {
    return this.beFarewellReactionsService.createReactionsFarewell(
      farewellReaction,
    );
  }

  @Delete(':farewellReactionId')
  async deleteFarewellReactions(
    @Req() req: Request,
    @Param('farewellReactionId') farewellReactionId: string,
  ) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beFarewellReactionsService.deleteFarewellReactions(
      farewellReactionId,
      currentProfileIds,
    );
  }
}
