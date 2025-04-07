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

  @Get('tweet')
  @UseGuards(AuthGuard('jwt'))
  async getTweet(
    @Query('tweetId') tweetId: string,
    @Query('profileId') profileId: string
  ) {
    return this.beTweetService.getTweet(tweetId, profileId);
  }

  @Get('tweets')
  @UseGuards(AuthGuard('jwt'))
  async getTweets(
    @Query('ids') ids: Array<{ tweetId: string; profileId: string }>
  ) {
    return this.beTweetService.getTweets(ids);
  }
}
