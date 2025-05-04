exports = async function (args) {
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see:
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = 'mongodb-atlas';

  // Update these to reflect your db/collection
  var dbName = 'kitouch';
  var collName = 'user';

  // Get a collection from the context
  var collection = context.services
    .get(serviceName)
    .db(dbName)
    .collection(collName);

  var findResult;
  try {
    // Execute a FindOne in MongoDB
    findResult = await collection.findOne(
      { accountId: BSON.ObjectId(args.accountId) },
      {}
    );
  } catch (err) {
    console.info(
      '[internalGetUser] Error occurred while executing findOne in getUser:',
      err.message
    );
    return { error: err.message };
  }

  try {
    findResult = await context.functions.execute('normalizeUser', findResult);
  } catch (err) {
    console.info('Error occurred while normilising user:', err.message);
    return { error: err.message };
  }

  return findResult;
};
