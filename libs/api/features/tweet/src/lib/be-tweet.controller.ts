import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BeTweetService } from './be-tweet.service';

@Controller('tweets')
export class BeTweetController {
  constructor(private beTweetService: BeTweetService) {}

  @Get('feed')
  @UseGuards(AuthGuard('jwt'))
  async getFeed(
    @Query('profileId') profileId: string,
    @Query('followingProfileIds') followingProfileIds?: Array<string>
  ) {
    console.log('FEED', profileId, followingProfileIds ?? []);
    return await this.beTweetService.getFeed(
      profileId,
      followingProfileIds ?? []
    );
  }
}
