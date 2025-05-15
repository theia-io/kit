exports = async function (arg) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  const tweetsCollection = db.collection('tweet');
  const profileId = BSON.ObjectId(arg.profileId);
  const followingProfileIds = arg.following?.map((followProfileId) =>
    BSON.ObjectId(followProfileId),
  );

  // this will return all tweets that user follows and ALL of their retweets (?)
  const result = await tweetsCollection.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          $or: [
            {
              profileId,
            },
            {
              profileId: {
                $in: followingProfileIds,
              },
            },
          ],
        },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'retweet',
          localField: '_id',
          foreignField: 'tweetId',
          as: 'retweetsData',
          pipeline: [],
        },
    },
    {
      $facet:
        /**
         * outputFieldN: The first output field.
         * stageN: The first aggregation stage.
         */
        {
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
            { $unset: ['retweetsData'] },
          ],
          // Keep original document
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
                // Get from the original tweet
                profileId: '$profileId',
                content: '$content',
                upProfileIds: '$retweetsData.upProfileIds',
              },
            },
          ], // Unwind the array: [ stageN, ... ]
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          allDocs: {
            $concatArrays: ['$original', '$unwound'],
          },
        },
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: '$allDocs',
        },
    },
    {
      $replaceWith:
        /**
         * replacementDocument: A document or string.
         */
        '$allDocs',
    },
    { $sort: { 'timestamp.createdAt': -1 } },
  ]);

  const resultArr = await result.toArray();

  console.info(resultArr);

  return resultArr.map((tweet) =>
    context.functions.execute('normalizeTweet', tweet),
  );
};
