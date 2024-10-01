exports = function (bookmark) {
  let {
    _id,
    tweetId,
    profileId,
    profileIdTweetyOwner,
    profileIdBookmarker,
    timestamp,
    ...rest
  } = bookmark;

  return {
    ...rest,
    id: _id.toString(),
    tweetId: tweetId.toString(),
    profileIdTweetyOwner: profileIdTweetyOwner.toString(),
    profileIdBookmarker: profileIdBookmarker.toString(),
    timestamp: {
      createdAt: timestamp?.createdAt?.toString() ?? 'null',
    },
  };
};
