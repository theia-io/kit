import { Auth0Kit, Bookmark as IBookmark } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeBookmarksService } from './be-bookmarks.service';

@Controller('bookmarks')
export class BeBookmarksController {
  constructor(private beBookmarksService: BeBookmarksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTweet(@Query('profileId') profileId: string) {
    return this.beBookmarksService.getBookmarks(profileId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async newBookmark(@Body() bookmarkDto: Partial<IBookmark>) {
    return this.beBookmarksService.newBookmark(bookmarkDto);
  }

  @Delete('all/:tweetId')
  @UseGuards(AuthGuard('jwt'))
  async deleteAllTweetBookmarks(@Param('tweetId') tweetId: string) {
    return this.beBookmarksService.deleteAllTweetBookmarks(tweetId);
  }

  @Delete(':bookmarkId')
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmark(
    @Req() req: Request,
    @Param('bookmarkId') bookmarkId: string
  ) {
    const authUser = req.user as Auth0Kit;
    const profileIds = authUser.profiles.map((profile) => profile.id);
    return this.beBookmarksService.deleteBookmark(bookmarkId, profileIds);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmarks(
    @Req() req: Request,
    @Query('tweetId') tweetId: string,
    @Query('profileIdBookmarker') profileIdBookmarker: string
  ) {
    const authUser = req.user as Auth0Kit;
    const profileIds = authUser.profiles.map((profile) => profile.id);

    if (!profileIds.includes(profileIdBookmarker)) {
      throw new HttpException(
        'You can delete only yours bookmark',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.beBookmarksService.deleteTweetFromBookmarks(
      tweetId,
      profileIdBookmarker
    );
  }
}
