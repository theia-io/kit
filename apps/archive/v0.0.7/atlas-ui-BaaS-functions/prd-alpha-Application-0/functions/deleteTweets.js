exports = async function (tweetIdArr) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  const tweetCollection = db.collection('tweet');

  let tweets;
  try {
    const objectIds = tweetIdArr.map((item) => ({
      _id: BSON.ObjectId(item.tweetId),
      profileId: BSON.ObjectId(item.profileId),
    }));

    tweets = tweetCollection.deleteMany({
      $or: objectIds,
    });

    bookmarksDeleted = tweetIdArr.map(({ tweetId, profileId }) =>
      context.functions.execute('deleteBookmark', {
        tweetId,
        profileIdBookmarker: profileId,
      })
    );

    await Promise.all([tweets, ...bookmarksDeleted]);
  } catch (err) {
    console.log(
      '[getTweets] Error occurred while deleting tweets:',
      err.message
    );
    return { error: 'Error occurred while deleting tweets: ' + err.message };
  }

  // maybe to verify that the count is equal?
  return tweetIdArr;
};
