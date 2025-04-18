import { Auth0Kit, TweetComment, Tweety } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
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
    return this.beTweetService.newTweet(tweetyDto);
  }

  @Delete(':tweetId')
  @UseGuards(AuthGuard('jwt'))
  async deleteTweet(
    @Req() req: Request,
    @Param('tweetId') tweetId: string,
    @Query('profileId') profileId: string
  ) {
    const authUser = req.user as Auth0Kit;
    const profileIds = authUser.profiles.map((profile) => profile.id);
    return this.beTweetService.deleteTweet(tweetId, profileId, profileIds);
  }

  @Put(':tweetId/like')
  @UseGuards(AuthGuard('jwt'))
  async likeTweet(
    @Param('tweetId') tweetId: string,
    @Query('profileId') profileId: string
  ) {
    return this.beTweetService.likeTweet(tweetId, profileId);
  }

  @Post(':tweetId/comment')
  @UseGuards(AuthGuard('jwt'))
  async addComment(
    @Param('tweetId') tweetId: string,
    @Body() commentDto: Partial<TweetComment>
  ) {
    return this.beTweetService.newTweetComment(tweetId, commentDto);
  }

  @Delete(':tweetId/comment')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(
    @Req() req: Request,
    @Param('tweetId') tweetId: string,
    @Query('profileId') profileId: string,
    @Query('content') content: string
  ) {
    const profileIds = (req.user as Auth0Kit).profiles.map(
      (profile) => profile.id
    );
    return this.beTweetService.deleteTweetComment(
      tweetId,
      profileId,
      content,
      profileIds
    );
  }
}
