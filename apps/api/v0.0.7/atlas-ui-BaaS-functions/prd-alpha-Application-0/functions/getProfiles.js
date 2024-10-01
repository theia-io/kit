exports = async function (profiles) {
  const profilesCollection = context.services
    .get('mongodb-atlas')
    .db('kitouch')
    .collection('profile');

  let profilesFollowing;
  try {
    profilesFollowing = await profilesCollection.find({
      _id: {
        $in: profiles.map((id) => BSON.ObjectId(id)),
      },
    });
  } catch (err) {
    console.error(
      'Error occurred while executing find in profilesCollection:',
      err.message
    );
    return { error: err.message };
  }

  try {
    profilesFollowing = await profilesFollowing.toArray();
    profilesFollowing = profilesFollowing.map((profile) =>
      context.functions.execute('normalizeProfile', profile)
    );
  } catch (err) {
    console.error('Error occurred while preparing data for FE:', err.message);
    return { error: err.message };
  }

  return profilesFollowing;
};
