import { ReTweety } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ReTweet, ReTweetDocument, Tweet, TweetDocument } from './schemas';
import { profile } from 'console';

@Injectable()
export class BeReTweetService {
  constructor(
    @InjectModel(ReTweet.name) private retweetModel: Model<ReTweetDocument>,
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>
  ) {}

  async getReTweet(retweetId: string, profileId: string) {
    let retweet;

    try {
      retweet = await this.retweetModel
        .findOne<TweetDocument>({
          _id: new mongoose.Types.ObjectId(retweetId),
          profileId: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute retweet search for %s, %s`,
        retweetId,
        profileId,
        err
      );
      throw new HttpException(
        'Cannot find retweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return retweet;
  }

  async newReTweet({ retweetedProfileId, tweetId }: Partial<ReTweety>) {
    let newReTweet, originalTweet;

    try {
      originalTweet = await this.tweetModel
        .findOne<TweetDocument>({
          _id: new mongoose.Types.ObjectId(tweetId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute tweet search for %s, %s`, tweetId, err);
      throw new HttpException(
        'Cannot find tweet for retweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      newReTweet = await this.retweetModel.create({
        tweetId: new mongoose.Types.ObjectId(tweetId),
        profileId: new mongoose.Types.ObjectId(retweetedProfileId),
      });
    } catch (err) {
      console.error(
        `Cannot create new retweet %s`,
        JSON.stringify(newReTweet),
        err
      );
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const tweet = originalTweet?.toObject(),
      retweet = newReTweet.toObject();

    return {
      ...retweet,
      type: 'retweet',
      retweetedProfileId: retweet.profileId,
      profileId: tweet?.profileId,
      content: tweet?.content,
      comments: tweet?.comments,
    };
  }

  async deleteReTweet(
    retweetId: string,
    profileId: string,
    loggedInProfiles: Array<string>
  ) {
    const retweet = await this.getReTweet(retweetId, profileId);
    if (!retweet) {
      throw new HttpException('ReTweet not found', HttpStatus.NOT_FOUND);
    }

    if (
      !loggedInProfiles.some(
        (loggedInProfileId) =>
          retweet?.profileId.toString() === loggedInProfileId
      )
    ) {
      throw new HttpException(
        'You can delete only yours retweet',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await retweet.deleteOne();
      // await this.retweetModel.deleteOne({
      //   tweetId: new mongoose.Types.ObjectId(retweetId),
      //   profileId: new mongoose.Types.ObjectId(retweet.profileId),
      // });
    } catch (err) {
      console.error(`Cannot delete retweet %s, %s`, retweetId, profileId, err);
      throw new HttpException(
        'Cannot delete retweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async deleteReTweets(tweetId: string) {
    try {
      await this.retweetModel
        .deleteMany({
          tweetId: new mongoose.Types.ObjectId(tweetId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute retweets search and delete for %s`,
        tweetId,
        err
      );
      throw new HttpException(
        'Cannot find and delete retweets',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }
}
