/*
  This function will run after a user is created and is called with an object representing that user.

  This function runs as a System user and has full access to Services, Functions, and MongoDB Data.

  Example below:

  exports = (user) => {
    // use collection that Custom User Data is configured on
    const collection = context.services.get("<SERVICE_NAME>").db("<DB_NAME>").collection("<COLL_NAME>");

    // insert custom data into collection, using the user id field that Custom User Data is configured on
    const doc = collection.insertOne({ <USER_ID_FIELD>: user.id, name: user.data.name });
  };
*/

exports = async function onUserCreation(user) {
  const db = context.services.get('mongodb-atlas').db('kitouch');

  const accountCollection = db.collection('account');

  const accountSettingsCollection = db.collection('accountSettings');

  const userCollection = db.collection('user');

  const profileCollection = db.collection('profile');

  try {
    const accountSettingsId = await accountSettingsCollection.insertOne({
      subscriptionOns: [],
    });

    const accountId = await accountCollection.insertOne({
      // Save the user's account ID to your configured user_id_field
      userId: BSON.ObjectId(user.id),
      settingsId: accountSettingsId.insertedId,
      // Store any other user data you want
      email: user.data.email,
      type: user.type,
      status: 'active',
      //
      data: user.data,
      customData: user.custom_data,
      identities: user.identities,
    });

    const userId = await userCollection.insertOne({
      accountId: accountId.insertedId,
      name: user.data.first_name,
      surname: user.data.last_name,
    });

    await profileCollection.insertOne({
      userId: userId.insertedId,
      name: user.data.name,
      pictures: [
        {
          url: user.data.picture,
          isPrimary: true,
        },
      ],
    });
  } catch (e) {
    console.error(
      `Failed to create custom user data document for user:${user.id}`
    );
    throw e;
  }
};
