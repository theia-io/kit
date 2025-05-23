import { Profile, TweetComment, Tweety } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types } from 'mongoose';
import { Tweet, TweetDocument } from './schemas';

@Injectable()
export class BeTweetService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>
  ) {}

  // TODO: create & migrate to "Feed" module
  async getFeed(
    profileId: string,
    followingProfileIds: Array<string>,
    limit = 20,
    cursorString?: string
  ) {
    const queryLimit = limit + 1;
    const sortOrder = -1; // Descending for newest first

    const cursorPipeline: PipelineStage[] = [];

    // Handle Cursor for Pagination
    if (cursorString) {
      try {
        const [timestampStr, idStr] = cursorString.split('_');
        const cursorTimestamp = new Date(parseInt(timestampStr, 10));
        if (
          !Types.ObjectId.isValid(idStr) ||
          isNaN(cursorTimestamp.getTime())
        ) {
          throw new Error('Invalid cursor components');
        }
        const cursorId = new Types.ObjectId(idStr);

        cursorPipeline.push({
          $match: {
            $or: [
              // { createdAt: { $lt: cursorTimestamp } },
              { createdAt: cursorTimestamp, _id: { $lt: cursorId } },
              {
                createdAt: cursorTimestamp,
                retweetedProfileId: { $lt: cursorId },
              },
              // {
              //   'timestamp.createdAt': cursorTimestamp,
              //   // _id: { $lt: cursorId },
              // },
              {
                'timestamp.createdAt': cursorTimestamp,
                _id: { $lt: cursorId },
              },
              {
                'timestamp.createdAt': cursorTimestamp,
                retweetedProfileId: { $lt: cursorId },
              },
            ],
          },
        });
      } catch (error) {
        console.error(
          `Invalid cursor string for aggregation: ${cursorString}`,
          error
        );
        throw new HttpException(
          'Invalid cursor format.',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    //  Sort (Primary sort for pagination, _id for tie-breaking)
    cursorPipeline.push({
      // $sort: { createdAt: sortOrder, _id: sortOrder },
      $sort: { createdAt: sortOrder },
    });

    // Limit (Fetch one extra to check for next page)
    cursorPipeline.push({ $limit: queryLimit });

    // 5. Add Lookups / Projections for final feed item shape
    // Example: Populate profile information
    // pipeline.push({
    //   $lookup: {
    //     from: 'profiles', // Actual name of your profiles collection
    //     localField: 'profileId',
    //     foreignField: '_id',
    //     as: 'authorProfile'
    //   }
    // });
    // pipeline.push({
    //   $unwind: { path: '$authorProfile', preserveNullAndEmptyArrays: true }
    // });

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
            // activityTimestamp: '$createdAt',
          },
        },
        // Stage 3: Union with retweets from relevant profiles
        {
          $unionWith: {
            coll: 'retweet', // <<< actual retweet collection name
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
              // 3d: Project the desired structure for retweet feed tweets
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
                  comments: '$originalTweetData.comments',
                  upProfileIds: '$originalTweetData.upProfileIds',
                  downProfileIds: '$originalTweetData.downProfileIds',

                  // activityTimestamp: '$createdAt', // Use createdAt of the retweet for sorting
                },
              },
              // --- Pipeline within unionWith ends here ---
            ],
          },
        },
        // Stage 4: Sort the combined feed by the activity timestamp (descending)
        // {
        //   $sort: {
        //     activityTimestamp: -1,
        //   },
        // },

        // Stage 5: (Optional) Add limit/skip for pagination
        // { $skip: 0 },
        // { $limit: 20 },

        // Stage 6: (Optional) Project final fields, remove activityTimestamp if not needed
        // {
        //   $project: {
        //     activityTimestamp: 0, // Remove the temporary sort field
        //   },
        // },

        // Stage 7: Cursor pipeline if applicable
        ...cursorPipeline,
      ];

      tweets = await this.tweetModel.aggregate<TweetDocument>(agg).exec();
    } catch (err) {
      console.error('Cannot execute tweets feed search', err);
      throw new HttpException(
        'Cannot execute tweet feed search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    let hasNextPage = false;
    let nextCursor: string | null = null;

    if (tweets.length === queryLimit) {
      hasNextPage = true;
      tweets.pop();
    }

    if (tweets.length > 0 && hasNextPage) {
      const lastTweet = tweets[tweets.length - 1] as any;
      const createdAt = (
        lastTweet.createdAt ??
        lastTweet.timestamp?.createdAt ??
        lastTweet.updatedAt ??
        lastTweet.timestamp?.updatedAt
      )?.toString();
      // Ensure createdAt is handled correctly (might be string from aggregation if not cast)
      // const lastTweet = lastItem.toJSON() as unknown as Tweety;
      const lastItemTimestamp = new Date(createdAt).getTime();
      nextCursor = `${lastItemTimestamp}_${lastTweet._id.toString()}`;
    }

    console.log('RESULT 3', tweets, nextCursor, hasNextPage);

    return {
      nextCursor,
      hasNextPage,
      tweets:
        tweets?.map(({ _id, __v, ...tweet }) => ({
          ...tweet,
          id: _id,
        })) ?? [],
    };
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
        `Cannot execute tweet search for %s, %s`,
        tweetId,
        tweetProfileId,
        err
      );
      throw new HttpException(
        'Cannot find tweet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      ...tweet?.toJSON(),
      type: 'tweet',
    };
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
      console.error(`Cannot execute tweet search for %s`, tweetId, err);
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
      console.error(`Cannot execute tweets search for %s`, ids, err);
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return tweets.map(({ _id, ...tweet }) => ({
      ...tweet,
      type: 'tweet',
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
      console.error(`Cannot create new tweet %s`, JSON.stringify(tweet), err);
      throw new HttpException(
        'Cannot execute tweets search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      ...newTweet.toObject(),
      type: 'tweet',
    };
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
        (loggedInProfileId) => tweet.profileId?.toString() === loggedInProfileId
      )
    ) {
      throw new HttpException(
        'You can delete only yours tweet',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await this.tweetModel.deleteOne({
        _id: new mongoose.Types.ObjectId(tweetId),
        profileId: tweet.profileId,
      });
    } catch (err) {
      console.error(`Cannot delete tweet %s, %s`, tweetId, profileId, err);
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
        `Cannot execute find tweet %s, with %s`,
        tweetId,
        likeProfileId,
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
        `Cannot update tweet %s, with %s`,
        tweetId,
        likeProfileId,
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
        `Cannot add new comment to tweet %s, %s, %s`,
        tweetId,
        profileId,
        content,
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
        `Cannot delete tweet %s, comment's %s, %s`,
        tweetId,
        profileId,
        content,
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
