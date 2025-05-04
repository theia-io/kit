import { Auth0Kit, ReTweety } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BeReTweetService } from './be-retweet.service';

@Controller('retweets')
export class BeReTweetController {
  constructor(private beReTweetService: BeReTweetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async newReTweet(@Body() retweetyDto: Partial<ReTweety>) {
    return this.beReTweetService.newReTweet(retweetyDto);
  }

  @Delete(':retweetId')
  @UseGuards(AuthGuard('jwt'))
  async deleteRetweet(
    @Req() req: Request,
    @Param('retweetId') retweetId: string,
    @Query('profileId') profileId: string
  ) {
    const authUser = req.user as Auth0Kit;
    const profileIds = authUser.profiles?.map((profile) => profile.id) ?? [];
    return this.beReTweetService.deleteReTweet(
      retweetId,
      profileId,
      profileIds
    );
  }

  /** TODO  @Danylo think on business logic for deleting retweets */
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteRetweets(@Query('tweetId') tweetId: string) {
    return this.beReTweetService.deleteReTweets(tweetId);
  }
}
