exports = async function (newTweet) {
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see:
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = 'mongodb-atlas';

  // Update these to reflect your db/collection
  var dbName = 'kitouch';
  var collName = 'tweet';

  // Get a collection from the context
  var collection = context.services
    .get(serviceName)
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
      },
    );
  } catch (err) {
    console.error(
      '[postTweet] Error occurred while adding tweet:',
      err.message,
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
      err.message,
    );
    return { error: 'Error occurred while normilizing tweet: ' + err.message };
  }

  return tweet;
};
