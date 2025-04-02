import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeTweetController } from './be-tweet.controller';
import { BeTweetService } from './be-tweet.service';
import { Tweet, TweetSchema } from './schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tweet.name,
        useFactory: () => TweetSchema,
      },
    ]),
  ],
  controllers: [BeTweetController],
  providers: [BeTweetService],
  exports: [BeTweetService],
})
export class BeTweetModule {}
