/** @TODO @FIXME deprecated, use `getTweets` instead. */
exports = async function (arg) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  // Get a collection from the context
  const tweetCollection = db.collection('tweet');
  const profileCollection = db.collection('profile');

  let tweet;
  try {
    tweet = await tweetCollection.findOne({
      _id: BSON.ObjectId(arg.tweetId),
      profileId: BSON.ObjectId(arg.profileId),
    });
  } catch (err) {
    console.info('[postTweet] Error occurred while adding tweet:', err.message);
    return { error: 'Error occurred while executing findOne: ' + err.message };
  }

  try {
    tweet = await context.functions.execute('normalizeTweet', tweet);
  } catch (err) {
    console.info(
      '[postTweet] Error occurred while normalizing tweet:',
      err.message,
    );
    return { error: 'Error occurred while executing findOne: ' + err.message };
  }

  return tweet;
};
