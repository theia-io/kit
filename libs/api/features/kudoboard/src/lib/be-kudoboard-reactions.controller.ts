import { KudoBoardReaction } from '@kitouch/shared-models';
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
import { AuthGuard } from '@nestjs/passport';
import { BeKudoBoardReactionsService } from './be-kudoboard-reactions.service';

@Controller('kudoboard-reactions')
export class BeKudoBoardReactionsController {
  constructor(
    private beKudoBoardReactionsService: BeKudoBoardReactionsService
  ) {}

  @Get(':kudoBoardId')
  @UseGuards(AuthGuard('jwt'))
  async getReactionsKudoBoard(@Param('kudoBoardId') kudoBoardId: string) {
    console.log('kudoBoardId', kudoBoardId);
    if (!kudoBoardId) {
      throw new HttpException(
        'kudoboardId is required',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.beKudoBoardReactionsService.getReactionsKudoBoard(kudoBoardId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReactionsKudoBoard(@Body() kudoBoardReaction: KudoBoardReaction) {
    console.log('kudoBoardReaction', kudoBoardReaction);
    return this.beKudoBoardReactionsService.createReactionsKudoBoard(
      kudoBoardReaction
    );
  }

  @Delete(':kudoBoardReactionId')
  @UseGuards(AuthGuard('jwt'))
  async deleteKudoboardReactions(
    @Param('kudoBoardReactionId') kudoBoardReactionId: string
  ) {
    return this.beKudoBoardReactionsService.deleteKudoboardReactions(
      kudoBoardReactionId
    );
  }
}
