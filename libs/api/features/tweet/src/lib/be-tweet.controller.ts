import { Tweety } from '@kitouch/shared-models';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTweets(@Query('ids') ids: string) {
    const parsedIds: Array<{ tweetId: string; profileId: string }> =
      JSON.parse(ids);
    return this.beTweetService.getTweets(parsedIds);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async newTweet(@Body() tweetyDto: Partial<Tweety>) {
    console.log('NEW TWEET DTO', tweetyDto);
    return this.beTweetService.newTweet(tweetyDto);
  }
}
