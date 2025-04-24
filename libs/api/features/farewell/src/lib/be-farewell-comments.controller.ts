import { filter } from 'rxjs';
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
import { BeFarewellCommentsService } from './be-farewell-comments.service';
import { FarewellComment } from './schemas/farewell-comments.schema';
import { Request } from 'express';
import { Auth0Kit } from '@kitouch/shared-models';

@Controller('farewell-comments')
export class BeFarewellCommentsController {
  constructor(private beFarewellCommentsService: BeFarewellCommentsService) {}

  @Get(':farewellId')
  async getCommentsFarewell(@Param('farewellId') farewellId: string) {
    if (!farewellId) {
      throw new HttpException('farewellId is required', HttpStatus.BAD_REQUEST);
    }

    return this.beFarewellCommentsService.getCommentsFarewell(farewellId);
  }

  @Post()
  async createCommentsFarewell(@Body() farewellComment: FarewellComment) {
    console.log('farewellComment', farewellComment);
    return this.beFarewellCommentsService.createCommentFarewell(
      farewellComment
    );
  }

  @Post('batch')
  async batchCreateCommentsFarewell(
    @Body() farewellComments: Array<FarewellComment>
  ) {
    console.log('farewellComments', farewellComments);
    return this.beFarewellCommentsService.createCommentsFarewell(
      farewellComments
    );
  }

  @Delete(':farewellCommentId')
  // TODO think on having and checking a auth
  async deleteFarewellComments(
    @Req() req: Request,
    @Param('farewellCommentId') farewellCommentId: string
  ) {
    const currentProfileIds = ((req.user as Auth0Kit)?.profiles ?? [])
      .map((profile) => profile?.id)
      .filter(Boolean);

    return this.beFarewellCommentsService.deleteFarewellComments(
      farewellCommentId,
      currentProfileIds
    );
  }
}
