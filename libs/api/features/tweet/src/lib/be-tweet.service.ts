import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Tweet, TweetDocument } from './schemas';

@Injectable()
export class BeTweetService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>
  ) {}

  async getFeed(profileId: string, followingProfileIds?: Array<string>) {
    const agg: Array<PipelineStage> = [
      {
        $lookup: {
          from: 'retweet',
          localField: '_id',
          foreignField: 'tweetId',
          as: 'retweetsData',
          pipeline: [
            {
              $match: {
                $or: [
                  {
                    profileId: profileId,
                  },
                  {
                    profileId: {
                      $in: followingProfileIds ?? [],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $facet: {
          original: [
            {
              $replaceRoot: {
                newRoot: '$$ROOT',
              },
            },
            {
              $addFields: {
                type: 'tweet',
              },
            },
          ],
          unwound: [
            {
              $unwind: '$retweetsData',
            },
            {
              $match: {
                'retweetsData._id': {
                  $exists: true,
                },
              },
            },
            {
              $project: {
                _id: '$retweetsData._id',
                referenceId: '$retweetsData.tweetId',
                referenceProfileId: '$retweetsData.profileId',
                timestamp: '$retweetsData.timestamp',
                type: 'retweet',
                //
                // Get from the original tweet
                profileId: '$profileId',
                content: '$content',
                upProfileIds: '$retweetsData.upProfileIds',
              },
            },
          ],
        },
      },
      {
        $project: {
          allDocs: {
            $concatArrays: ['$original', '$unwound'],
          },
        },
      },
      {
        $unwind: {
          path: '$allDocs',
        },
      },
      {
        $replaceWith: '$allDocs',
      },
      // {
      //   $match: {
      //     $or: [
      //       {
      //         profileId: profileId,
      //       },
      //       {
      //         profileId: {
      //           $in: followingProfileIds ?? [],
      //         },
      //       },
      //       {
      //         referenceProfileId: profileId,
      //       },
      //       {
      //         referenceProfileId: {
      //           $in: followingProfileIds ?? [],
      //         },
      //       },
      //     ],
      //   },
      // },
      { $sort: { 'timestamp.createdAt': -1 } },
    ];

    let tweets;

    try {
      tweets = await this.tweetModel.aggregate<TweetDocument>(agg).exec();
      //   const accounts = await this.accountModel.find().exec();
      //   account = accounts?.[0];
    } catch (err) {
      console.error('Cannot execute tweets feed search', err);
      throw new HttpException(
        'Cannot execute tweet feed search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweets.map((tweet) => ({
      ...tweet,
      id: tweet._id,
    }));
  }

  async getTweet(tweetId: string, profileId: string) {
    let tweet;

    try {
      tweet = await this.tweetModel
        .findOne<TweetDocument>({
          _id: new mongoose.Types.ObjectId(tweetId),
          profileId: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute tweet search for ${tweetId}, ${profileId}`,
        err
      );
      throw new HttpException(
        'Cannot execute tweet feed search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweet;
  }

  async getTweets(ids: Array<{ tweetId: string; profileId: string }>) {
    const agg: Array<PipelineStage> = [
      {
        $or: ids.map(({ tweetId, profileId }) => ({
          _id: new mongoose.Types.ObjectId(tweetId),
          profileId: new mongoose.Types.ObjectId(profileId),
        })),
      },
      {
        sort: {
          'timestamp.createdAt': -1,
        },
      },
    ];

    let tweets;

    try {
      tweets = await this.tweetModel.aggregate<TweetDocument>(agg).exec();
    } catch (err) {
      console.error(`Cannot execute tweets search for ${ids}`, err);
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweets;
  }
}
