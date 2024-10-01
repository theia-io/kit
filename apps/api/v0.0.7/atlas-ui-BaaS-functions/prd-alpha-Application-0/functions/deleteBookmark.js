exports = async function (arg) {
  const bookmarkCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('bookmark');

  let deletedBookmark;
  try {
    deletedBookmark = await bookmarkCollection.findOneAndDelete({
      tweetId: BSON.ObjectId(arg.tweetId),
      profileIdBookmarker: BSON.ObjectId(arg.profileIdBookmarker),
    });
  } catch (err) {
    console.log(
      'Error occurred while executing findOneAndDelete:',
      err.message
    );
    return { error: err.message };
  }

  try {
    deletedBookmark = context.functions.execute(
      'normalizeBookmark',
      deletedBookmark
    );
  } catch (err) {
    console.error(
      '[deleteBookmark] Error occurred while normilizing deleted bookmark:',
      err.message
    );
    return {
      error:
        'Error occurred while normilizing deleted bookmark: ' + err.message,
    };
  }

  return deletedBookmark;
};
