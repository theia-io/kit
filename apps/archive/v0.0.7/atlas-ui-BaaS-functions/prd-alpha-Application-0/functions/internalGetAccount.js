exports = async function (userId) {
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see:
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = 'mongodb-atlas';

  // Update these to reflect your db/collection
  var dbName = 'kitouch';
  var collName = 'account';

  // Get a collection from the context
  const db = context.services.get(serviceName).db('kitouch');
  const accountCollection = db.collection('account'),
    settings = db.collection('accountSettings');

  var findResult;
  try {
    // Execute a FindOne in MongoDB
    findResult = await accountCollection.findOne(
      { userId: BSON.ObjectId(userId) },
      {}
    );
  } catch (err) {
    console.log(
      '[internalGetAccount] Error occurred while executing findOne in account collection:',
      err.message
    );
    return { error: err.message };
  }

  try {
    findResult = await context.functions.execute(
      'normalizeAccount',
      findResult
    );
  } catch (err) {
    console.log('Error occurred while normilising account:', err.message);
    return { error: err.message };
  }

  return findResult;
};
