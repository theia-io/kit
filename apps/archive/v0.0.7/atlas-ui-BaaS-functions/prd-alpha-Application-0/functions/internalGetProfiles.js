exports = async function (args) {
  var collection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('profile');

  var findResult;
  try {
    findResult = await collection.find({ userId: BSON.ObjectId(args.userId) });
  } catch (err) {
    console.info(
      '[internalGetProfiles] Error occurred while executing findOne:',
      err.message
    );
    return { error: err.message };
  }

  findResultArr = await findResult.toArray();
  try {
    findResultArr = findResultArr.map(
      async (profile) =>
        await context.functions.execute('normalizeProfile', profile)
    );
  } catch (err) {
    console.info('Error occurred while normilising profile:', err.message);
    return { error: err.message };
  }

  return findResultArr;
};
