exports = async function (newTweet) {
  // Get a collection from the context
  const legalCollection = context.services
    .get('serviceName')
    .db(dbName)
    .collection(collName);

  var tweet;
  try {
    const profileId = newTweet.profileId;

    // Execute a FindOne in MongoDB
    tweet = await collection.findOneAndUpdate(
      {
        _id: new BSON.ObjectId(),
      },
      {
        $set: {
          ...newTweet,
          //
          profileId: BSON.ObjectId(profileId),
          //
        },
        $currentDate: {
          'timestamp.createdAt': true,
          'timestamp.updatedAt': true,
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
      '[postTweet] Error occurred while adding tweet:',
      err.message
    );
    return {
      error: 'Error occurred while executing findOneAndUpdate: ' + err.message,
    };
  }

  try {
    tweet = context.functions.execute('normalizeTweet', tweet);
  } catch (err) {
    console.error(
      '[postTweet] Error occurred while normilizing tweet:',
      err.message
    );
    return { error: 'Error occurred while normilizing tweet: ' + err.message };
  }

  return tweet;
};
