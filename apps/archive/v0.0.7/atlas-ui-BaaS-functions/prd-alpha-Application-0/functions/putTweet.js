exports = async function (tweet) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  const tweetCollection =
    tweet.type === 'retweet'
      ? db.collection('retweet')
      : db.collection('tweet');

  const { id, profileId, type, timestamp, ...restTweet } = tweet;

  // unique and <correct> profileIds
  const upProfilesSet = new Set();
  restTweet.upProfileIds?.forEach((upProfile) => {
    if (typeof upProfile === 'string') {
      upProfilesSet.add(upProfile);
    }
  });
  restTweet.upProfileIds = [...upProfilesSet];

  // comments
  restTweet.comments =
    restTweet.comments?.map((comment) => {
      if (!comment.createdAt) {
        comment.createdAt = new Date();
      }

      return comment;
    }) ?? [];

  let updatedTweetDocument;
  try {
    updatedTweetDocument = await tweetCollection.findOneAndUpdate(
      {
        _id: BSON.ObjectId(id),
      },
      {
        $set: restTweet,
        $currentDate: {
          'timestamp.updatedAt': true,
        },
      },
      {
        new: true,
        returnNewDocument: true,
        returnDocument: 'after',
      },
    );

    updatedTweetDocument = context.functions.execute(
      'normalizeTweet',
      updatedTweetDocument,
    );
  } catch (err) {
    console.log('Error occurred while updating tweet:', err.message);
    return {
      error: 'Error occurred while performing the operation: ' + err.message,
    };
  }

  return { ...updatedTweetDocument };
};
