exports = async function (user) {
  let db = context.services.get('mongodb-atlas').db('kitouch');
  let profileCollection = db.collection('profile'),
    userCollection = db.collection('user');

  console.log(user.name);
  let allUsers, matchingUsers;
  try {
    allUsers = await userCollection
      .find({ _id: { $ne: BSON.ObjectId(user.id) } })
      .toArray();
  } catch (err) {
    console.log('Error occurred while finding the match:', err.message);
    return { error: err.message };
  }

  const getExperienceIntersection = (
    { startDate: s1, endDate: e1 },
    { startDate: s2, endDate: e2 }
  ) => {
    const NOW = new Date();

    const s1Number = new Date(s1).getTime(),
      e1Number = (e1 ? new Date(e1) : NOW).getTime(),
      s2Number = new Date(s2).getTime(),
      e2Number = (e2 ? new Date(e2) : NOW).getTime();

    return (
      (s1Number - s2Number >= 0 && e2Number - s1Number >= 0) ||
      (s2Number - s1Number >= 0 && e1Number - s2Number >= 0)
    );
  };

  matchingUsers = allUsers.filter((anotherUser) =>
    user.experiences?.some((thisUserExperience) =>
      anotherUser.experiences?.some((anotherUserExperience) =>
        getExperienceIntersection(thisUserExperience, anotherUserExperience)
      )
    )
  );

  const matchingUsersIds = matchingUsers.map(
    (matchingUser) => matchingUser._id
  );

  console.log('matchingUsersIds', matchingUsersIds);

  let matchingUserProfiles;
  try {
    matchingUserProfiles = await profileCollection
      .aggregate([
        {
          $match: {
            userId: { $in: matchingUsersIds },
          },
        },
      ])
      .toArray();
  } catch (err) {
    console.log(
      'Error occurred while finding the matching profiles of matched users:',
      err.message
    );
    return { error: err.message };
  }

  console.log('matchingUserProfiles', matchingUserProfiles);

  return matchingUserProfiles;
};
