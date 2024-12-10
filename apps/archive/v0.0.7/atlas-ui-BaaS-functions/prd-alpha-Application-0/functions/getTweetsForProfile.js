exports = async function (arg) {
  // Get a collection from the context
  const tweetsCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('tweet');
  const profileCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('profile');

  const profileId = BSON.ObjectId(arg.profileId);

  const profileDoc = profileCollection.findOne({
    _id: profileId,
  });
  const tweetsDocs = tweetsCollection
    .find({
      profileId: BSON.ObjectId(arg.profileId),
    })
    .sort({
      'timestamp.createdAt': -1,
    });

  const [profile, tweets] = await Promise.all([profileDoc, tweetsDocs]);
  const profileRes = context.functions.execute('normalizeProfile', profile);
  const tweetsArr = await tweets.toArray();

  return tweetsArr.map(({ _id, profileId, timestamp, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    profileId: profileId.toString(),
    timestamp: {
      createdAt: timestamp?.createdAt?.toString(),
      updatedAt: timestamp?.updatedAt?.toString(),
    },
    denormalization: {
      profile: profileRes,
    },
  }));
};
