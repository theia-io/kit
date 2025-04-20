import { KudoBoardComment as IKudoBoardComment } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BeKudoBoardCommentsService } from './be-kudoboard-comments.service';

@Controller('kudoboard-comments')
export class BeKudoBoardCommentsController {
  constructor(private beKudoBoardCommentsService: BeKudoBoardCommentsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getCommentsKudoBoards(@Query('kudoBoardIds') kudoBoardIds: string) {
    const kudoBoardIdsArray = kudoBoardIds.split(',');
    return this.beKudoBoardCommentsService.getCommentsKudoBoards(
      kudoBoardIdsArray
    );
  }

  @Get(':kudoBoardId')
  async getCommentsKudoBoard(@Param('kudoBoardId') kudoboardId: string) {
    return this.beKudoBoardCommentsService.getCommentsKudoBoard(kudoboardId);
  }

  @Post()
  async createCommentsKudoBoard(@Body() kudoBoardComments: IKudoBoardComment) {
    return this.beKudoBoardCommentsService.createCommentsKudoBoard(
      kudoBoardComments
    );
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async deleteKudoboardComments(@Param('commentId') commentId: string) {
    return this.beKudoBoardCommentsService.deleteKudoboardComments(commentId);
  }
}
