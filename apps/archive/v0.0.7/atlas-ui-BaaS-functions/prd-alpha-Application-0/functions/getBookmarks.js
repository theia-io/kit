exports = async function (profileIdBookmarker) {
  // Get a collection from the context
  const bookmarkCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('bookmark');

  let bookmarksArr;
  try {
    // Execute a FindOne in MongoDB
    bookmarksArr = await bookmarkCollection
      .find({
        profileIdBookmarker: BSON.ObjectId(profileIdBookmarker),
      })
      .sort({
        'timestamp.createdAt': -1,
      })
      .toArray();
  } catch (err) {
    console.error(
      '[getBookmarks][bookmarkCollection.find] Error occurred while getting bookmarks:',
      err.message
    );
    return {
      error: 'Error occurred while getting bookmarks: ' + err.message,
    };
  }

  try {
    bookmarksArr = bookmarksArr.map((bookmark) =>
      context.functions.execute('normalizeBookmark', bookmark)
    );
  } catch (err) {
    console.error(
      '[postTweet] Error occurred while normilizing bookmarks:',
      err.message
    );
    return {
      error: 'Error occurred while normilizing bookmarks: ' + err.message,
    };
  }

  return bookmarksArr;
};
