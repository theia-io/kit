import {
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BeFarewellCommentsService } from './be-farewell-comments.service';
import { FarewellComments } from './schemas/farewell-comments.schema';

@Controller('farewell-comments')
export class BeFarewellCommentsController {
  constructor(private beFarewellCommentsService: BeFarewellCommentsService) {}

  @Get(':farewellId')
  async getCommentFarewell(@Param('farewellId') farewellId: string) {
    console.log('farewellId', farewellId);
    if (!farewellId) {
      throw new HttpException('farewellId is required', HttpStatus.BAD_REQUEST);
    }
    return this.beFarewellCommentsService.getCommentsFarewell(farewellId);
  }
  @Post()
  async createCommentsFarewell(@Body() farewellComment: FarewellComments) {
    console.log('farewellComment', farewellComment);
    return this.beFarewellCommentsService.createCommentsFarewell(
      farewellComment
    );
  }

  @Delete(':farewellCommentId')
  async deleteFarewellComments(
    @Param('farewellCommentId') farewellCommentId: string
  ) {
    return this.beFarewellCommentsService.deleteFarewellComments(
      farewellCommentId
    );
  }
  @Get(':farewellId')
  async getCommentsFarewell(@Param('farewellId') farewellId: string) {
    console.log('farewellId', farewellId);
    if (!farewellId) {
      throw new HttpException('farewellId is required', HttpStatus.BAD_REQUEST);
    }
    return this.beFarewellCommentsService.getCommentsFarewell(farewellId);
  }
}
