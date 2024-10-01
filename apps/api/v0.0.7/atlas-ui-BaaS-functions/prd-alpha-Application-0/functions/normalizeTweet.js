exports = function (tweetDoc) {
  let { _id, profileId, referenceId, referenceProfileId, timestamp, ...rest } =
    tweetDoc;

  return {
    ...rest,
    id: _id?.toString(),
    profileId: profileId?.toString(),
    referenceId: referenceId?.toString(),
    referenceProfileId: referenceProfileId?.toString(),
    timestamp: {
      createdAt: timestamp?.createdAt?.toString(),
      updatedAt: timestamp?.updatedAt?.toString(),
    },
  };
};
