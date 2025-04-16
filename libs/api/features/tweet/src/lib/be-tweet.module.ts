import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeReTweetController } from './be-retweet.controller';
import { BeReTweetService } from './be-retweet.service';
import { BeTweetController } from './be-tweet.controller';
import { BeTweetService } from './be-tweet.service';
import { ReTweet, ReTweetSchema, Tweet, TweetSchema } from './schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tweet.name,
        useFactory: () => TweetSchema,
      },
      {
        name: ReTweet.name,
        useFactory: () => ReTweetSchema,
      },
    ]),
  ],
  controllers: [BeTweetController, BeReTweetController],
  providers: [BeTweetService, BeReTweetService],
  exports: [BeTweetService],
})
export class BeTweetModule {}
