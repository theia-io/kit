import { Profile, TweetComment, Tweety } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Tweet, TweetDocument } from './schemas';

@Injectable()
export class BeTweetService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>
  ) {}

  // TODO: create & migrate to "Feed" module
  async getFeed(profileId: string, followingProfileIds?: Array<string>) {
    let tweets;

    try {
      const profileIdObject = new mongoose.Types.ObjectId(profileId);
      // Ensure the user's own ID is always included for matching their own tweets/retweets
      const relevantProfileIds = [
        new mongoose.Types.ObjectId(profileIdObject),
        ...(followingProfileIds?.map((id) => new mongoose.Types.ObjectId(id)) ??
          []),
      ];

      const agg: Array<PipelineStage> = [
        // Stage 1: Match original tweets by relevant profiles
        {
          $match: {
            profileId: { $in: relevantProfileIds },
          },
        },
        // Stage 2: Add fields to identify as a tweet and set the activity timestamp
        {
          $addFields: {
            type: 'tweet',
            // Use createdAt of the tweet as the timestamp for sorting
            activityTimestamp: '$createdAt',
          },
        },
        // Stage 3: Union with retweets from relevant profiles
        {
          $unionWith: {
            coll: 'retweet', // <<< Your actual retweet collection name
            pipeline: [
              // --- Pipeline within unionWith starts here ---
              // 3a: Match retweets made by relevant profiles
              {
                $match: {
                  profileId: { $in: relevantProfileIds },
                },
              },
              // 3b: Lookup the original tweet data for each retweet
              {
                $lookup: {
                  from: 'tweet', // <<< Your actual tweet collection name
                  localField: 'tweetId',
                  foreignField: '_id',
                  as: 'originalTweetData',
                },
              },
              // 3c: Unwind the original tweet data (should always be one)
              {
                $unwind: {
                  path: '$originalTweetData',
                  preserveNullAndEmptyArrays: false, // Remove retweets if original tweet deleted
                },
              },
              // 3d: Project the desired structure for retweet feed items
              {
                $project: {
                  _id: '$_id', // Use the retweet's ID
                  type: 'retweet',
                  retweetedProfileId: '$profileId', // Who performed the retweet
                  tweetId: '$tweetId', // ID of the original tweet
                  createdAt: '$createdAt', // Timestamp of the retweet
                  updatedAt: '$updatedAt',
                  // --- Include data from the original tweet ---
                  profileId: '$originalTweetData.profileId', // Original author
                  content: '$originalTweetData.content',
                  comments: '$originalTweetData.comments', // Or other fields you need
                  // originalCreatedAt: '$originalTweetData.createdAt',
                  // originalUpdatedAt: '$originalTweetData.updatedAt',

                  activityTimestamp: '$createdAt', // Use createdAt of the retweet for sorting
                },
              },
              // --- Pipeline within unionWith ends here ---
            ],
          },
        },
        // Stage 4: Sort the combined feed by the activity timestamp (descending)
        {
          $sort: {
            activityTimestamp: -1,
          },
        },

        // Stage 5: (Optional) Add limit/skip for pagination
        // { $skip: 0 },
        // { $limit: 20 },

        // Stage 6: (Optional) Project final fields, remove activityTimestamp if not needed
        {
          $project: {
            activityTimestamp: 0, // Remove the temporary sort field
          },
        },
      ];

      tweets = await this.tweetModel.aggregate<TweetDocument>(agg).exec();
    } catch (err) {
      console.error('Cannot execute tweets feed search', err);
      throw new HttpException(
        'Cannot execute tweet feed search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweets.map(({ _id, __v, ...tweet }) => ({
      ...tweet,
      id: _id,
    }));
  }

  async getTweet(tweetId: string, tweetProfileId: string) {
    let tweet;

    try {
      tweet = await this.tweetModel
        .findOne<TweetDocument>({
          _id: new mongoose.Types.ObjectId(tweetId),
          profileId: new mongoose.Types.ObjectId(tweetProfileId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute tweet search for ${tweetId}, ${tweetProfileId}`,
        err
      );
      throw new HttpException(
        'Cannot find tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweet;
  }

  async #getTweetById(tweetId: string) {
    let tweet;

    try {
      tweet = await this.tweetModel
        .findOne<TweetDocument>({
          _id: new mongoose.Types.ObjectId(tweetId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute tweet search for ${tweetId}`, err);
      throw new HttpException(
        'Cannot find tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweet;
  }

  async getTweets(ids: Array<{ tweetId: string; profileId: string }>) {
    let tweets;

    try {
      const agg: Array<PipelineStage> = [
        {
          $match: {
            $or: ids.map(({ tweetId, profileId }) => ({
              _id: new mongoose.Types.ObjectId(tweetId),
              profileId: new mongoose.Types.ObjectId(profileId),
            })),
          },
        },
        {
          $sort: {
            'timestamp.createdAt': -1,
          },
        },
      ];

      tweets = await this.tweetModel.aggregate<TweetDocument>(agg).exec();
    } catch (err) {
      console.error(`Cannot execute tweets search for ${ids}`, err);
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweets.map(({ _id, ...tweet }) => ({
      ...tweet,
      id: _id.toString(),
    }));
  }

  async newTweet(tweet: Partial<Tweety>) {
    let newTweet;

    try {
      newTweet = await this.tweetModel.create({
        ...tweet,
        profileId: new mongoose.Types.ObjectId(tweet.profileId),
      });
    } catch (err) {
      console.error(`Cannot create new tweet ${JSON.stringify(tweet)}`, err);
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newTweet;
  }

  async deleteTweet(
    tweetId: string,
    profileId: string,
    loggedInUserProfiles: Array<string>
  ) {
    const tweet = await this.getTweet(tweetId, profileId);
    if (!tweet) {
      throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);
    }

    if (
      !loggedInUserProfiles.some(
        (loggedInProfileId) => tweet?.profileId.toString() === loggedInProfileId
      )
    ) {
      throw new HttpException(
        'You can delete only yours tweet',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.tweetModel.deleteOne({
        tweetId: new mongoose.Types.ObjectId(tweetId),
        profileId: new mongoose.Types.ObjectId(tweet.profileId),
      });
    } catch (err) {
      console.error(`Cannot delete tweet ${tweetId}, ${profileId}`, err);
      throw new HttpException(
        'Cannot delete tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async likeTweet(tweetId: Tweety['id'], likeProfileId: Profile['id']) {
    let updatedTweet;
    const likeProfileObjectId = new mongoose.Types.ObjectId(likeProfileId);

    try {
      updatedTweet = await this.tweetModel.findById(
        new mongoose.Types.ObjectId(tweetId)
      );
    } catch (err) {
      console.error(
        `Cannot execute find tweet ${tweetId}, with ${likeProfileId}`,
        err
      );
      throw new HttpException(
        'Cannot search tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!updatedTweet) {
      throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);
    }

    try {
      if (!updatedTweet.upProfileIds) {
        updatedTweet.upProfileIds = new Array(likeProfileObjectId);
      } else if (
        updatedTweet.upProfileIds.some((upProfileId) =>
          upProfileId.equals(likeProfileObjectId)
        )
      ) {
        updatedTweet.upProfileIds = updatedTweet.upProfileIds.filter(
          (like) => !like.equals(likeProfileObjectId)
        );
      } else {
        updatedTweet.upProfileIds.push(likeProfileObjectId);
      }

      await updatedTweet.save();
    } catch (err) {
      console.error(
        `Cannot update tweet ${tweetId}, with ${likeProfileId}`,
        err
      );
      throw new HttpException(
        'Cannot like tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedTweet;
  }

  async newTweetComment(
    tweetId: Tweety['id'],
    { profileId, content }: Partial<TweetComment>
  ) {
    let updatedTweet;

    try {
      updatedTweet = await this.tweetModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(tweetId) },
        {
          $push: {
            comments: {
              profileId: new mongoose.Types.ObjectId(profileId),
              content,
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    } catch (err) {
      console.error(
        `Cannot add new comment to tweet ${tweetId}, ${profileId}, ${content}`,
        err
      );
      throw new HttpException(
        'Cannot add new comment to tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedTweet;
  }

  async deleteTweetComment(
    tweetId: string,
    profileId: string,
    content: string,
    loggedInUserProfiles: Array<string>
  ) {
    const tweet = await this.#getTweetById(tweetId);
    if (!tweet) {
      throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);
    }

    const tweetDeletingComment = tweet.comments.find(
      (comment) =>
        comment.profileId.toString() === profileId &&
        comment.content === content
    );
    if (!tweetDeletingComment) {
      throw new HttpException(
        'Cannot find such tweet comment',
        HttpStatus.NOT_FOUND
      );
    }

    if (
      !loggedInUserProfiles.some(
        (loggedInProfileId) =>
          loggedInProfileId === tweetDeletingComment.profileId.toString()
      )
    ) {
      throw new HttpException(
        'You can delete only yours tweet comments',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      tweet.comments = tweet.comments.filter(
        (comment) =>
          !(
            comment.profileId.toString() === profileId &&
            comment.content === content
          )
      );
      await tweet.save();
    } catch (err) {
      console.error(
        `Cannot delete tweet ${tweetId}, comment's ${profileId}, ${content}`,
        err
      );
      throw new HttpException(
        "Cannot delete tweet's comment",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweet;
  }
}
