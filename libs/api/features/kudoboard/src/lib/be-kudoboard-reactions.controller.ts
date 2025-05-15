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
} from '@nestjs/common';
import { BeKudoBoardReactionsService } from './be-kudoboard-reactions.service';

@Controller('kudoboard-reactions')
export class BeKudoBoardReactionsController {
  constructor(
    private beKudoBoardReactionsService: BeKudoBoardReactionsService,
  ) {}

  @Get(':kudoBoardId')
  async getReactionsKudoBoard(@Param('kudoBoardId') kudoBoardId: string) {
    if (!kudoBoardId) {
      throw new HttpException(
        'kudoboardId is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.beKudoBoardReactionsService.getReactionsKudoBoard(kudoBoardId);
  }

  @Post()
  async createReactionsKudoBoard(@Body() kudoBoardReaction: KudoBoardReaction) {
    return this.beKudoBoardReactionsService.createReactionsKudoBoard(
      kudoBoardReaction,
    );
  }

  @Delete(':kudoBoardReactionId')
  async deleteKudoboardReactions(
    @Param('kudoBoardReactionId') kudoBoardReactionId: string,
  ) {
    return this.beKudoBoardReactionsService.deleteKudoboardReactions(
      kudoBoardReactionId,
    );
  }
}
