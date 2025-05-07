exports = async function (tweetIdArr) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  // Get a collection from the context
  const tweetCollection = db.collection('tweet');
  const profileCollection = db.collection('profile');

  let tweets;
  try {
    const objectIds = tweetIdArr.map((item) => ({
      _id: BSON.ObjectId(item.tweetId),
      profileId: BSON.ObjectId(item.profileId),
    }));

    tweets = await tweetCollection
      .find({
        $or: objectIds,
      })
      .sort({
        'timestamp.createdAt': -1,
      })
      .toArray();
  } catch (err) {
    console.info(
      '[getTweets] Error occurred while finding tweets:',
      err.message
    );
    return { error: 'Error occurred while finding tweets: ' + err.message };
  }

  try {
    tweets = tweets.map((tweet) =>
      context.functions.execute('normalizeTweet', tweet)
    );
  } catch (err) {
    console.info(
      '[postTweet] Error occurred while normalizing tweets:',
      err.message
    );
    return { error: 'Error occurred while normalizing tweets: ' + err.message };
  }

  return tweets;
};
