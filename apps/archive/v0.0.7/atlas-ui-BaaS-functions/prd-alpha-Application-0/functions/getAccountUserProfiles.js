exports = async function (googleUserId) {
  console.log('googleUserId111', googleUserId);

  let accountRes;
  try {
    accountRes = await context.functions.execute(
      'internalGetAccount',
      googleUserId
    );
  } catch (err) {
    console.log(
      '[getAccountUserProfiles] Error occurred while quering account:',
      err.message
    );
    return { error: err.message };
  }

  console.log('accountRes.id', accountRes.id);
  let userRes;
  try {
    userRes = await context.functions.execute('internalGetUser', {
      accountId: accountRes.id,
    });
  } catch (err) {
    console.log(
      '[getAccountUserProfiles] Error occurred while quering user:',
      err.message
    );
    return { error: err.message };
  }

  let profilesRes;
  try {
    profilesRes = await context.functions.execute('internalGetProfiles', {
      userId: userRes.id,
    });
  } catch (err) {
    console.log(
      '[getAccountUserProfiles] Error occurred while quering profiles:',
      err.message
    );
    return { error: err.message };
  }

  return { account: accountRes, user: userRes, profiles: profilesRes };
};