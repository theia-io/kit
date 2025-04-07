import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BeBookmarksService } from './be-bookmarks.service';

@Controller('bookmarks')
export class BeBookmarksController {
  constructor(private beBookmarksService: BeBookmarksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTweet(@Query('profileId') profileId: string) {
    return this.beBookmarksService.getBookmarks(profileId);
  }
}
