exports = async function (newBookmark) {
  // Get a collection from the context
  const bookmarkCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('bookmark');

  let bookmark;
  try {
    const {
      tweetId,
      profileIdTweetyOwner,
      profileIdBookmarker,
      ...restBookmark
    } = newBookmark;

    // Execute a FindOne in MongoDB
    bookmark = await bookmarkCollection.findOneAndUpdate(
      {
        _id: new BSON.ObjectId(),
      },
      {
        $set: {
          ...restBookmark,
          tweetId: BSON.ObjectId(tweetId),
          profileIdTweetyOwner: BSON.ObjectId(profileIdTweetyOwner),
          profileIdBookmarker: BSON.ObjectId(profileIdBookmarker),
          //
          //
        },
        $currentDate: {
          'timestamp.createdAt': true,
        },
      },
      {
        upsert: true,
        new: true,
        returnNewDocument: true,
        returnDocument: 'after',
      }
    );
  } catch (err) {
    console.error(
      '[postTweet] Error occurred while adding bookmark:',
      err.message
    );
    return {
      error: 'Error occurred while executing findOneAndUpdate: ' + err.message,
    };
  }

  try {
    bookmark = context.functions.execute('normalizeBookmark', bookmark);
  } catch (err) {
    console.error(
      '[postTweet] Error occurred while normilizing bookmark:',
      err.message
    );
    return {
      error: 'Error occurred while normilizing bookmark: ' + err.message,
    };
  }

  return bookmark;
};
