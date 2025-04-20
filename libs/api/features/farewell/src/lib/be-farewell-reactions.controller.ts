import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BeFarewellReactionsService } from './be-farewell-reactions.service';
import { AuthGuard } from '@nestjs/passport';
import { FarewellReaction } from '@kitouch/shared-models';

@Controller('farewell-reactions')
export class BeFarewellReactionsController {
  constructor(private beFarewellReactionsService: BeFarewellReactionsService) {}

  @Get(':farewellId')
  @UseGuards(AuthGuard('jwt'))
  async getReactionsFarewell(@Param('farewellId') farewellId: string) {
    console.log('farewellId', farewellId);
    if (!farewellId) {
      throw new HttpException('farewellId is required', HttpStatus.BAD_REQUEST);
    }
    return this.beFarewellReactionsService.getReactionsFarewell(farewellId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReactionsFarewell(@Body() farewellReaction: FarewellReaction) {
    console.log('farewellReaction', farewellReaction);
    return this.beFarewellReactionsService.createReactionsFarewell(
      farewellReaction
    );
  }

  @Delete(':farewellReactionId')
  @UseGuards(AuthGuard('jwt'))
  async deleteFarewellReactions(
    @Param('farewellReactionId') farewellReactionId: string
  ) {
    return this.beFarewellReactionsService.deleteFarewellReactions(
      farewellReactionId
    );
  }
}
