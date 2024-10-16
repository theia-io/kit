exports = async function (args) {
  const { collection, executeFn, filter, query, options = {} } = args;
  // Get a collection from the context
  const dbCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection(collection);

  let result;
  try {
    result = await dbCollection[executeFn](filter, query, options);
  } catch (err) {
    console.log('Error occurred while executing findOne:', err.message);
    return { error: err.message };
  }

  return result;
};
