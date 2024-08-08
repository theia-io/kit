import { Account, Legal, Profile, User } from '@kitouch/shared-models';
import { clientDBAdapter, dbClientAdapter, DBClientType } from '@kitouch/utils';
import { BSON } from 'realm-web';

/** DB => Client */
export const dbClientProfileAdapter = (
  dbObject: DBClientType<Profile>
): Profile => {
  const { userId, ...dbClientProfile } = dbClientAdapter(dbObject);

  return {
    ...dbClientProfile,
    userId: userId?.toString(),
    following: dbClientProfile.following?.map(({ id, ...rest }) => ({
      ...rest,
      id: id?.toString(),
    })),
    followers: dbClientProfile.followers?.map(({ id, ...rest }) => ({
      ...rest,
      id: id?.toString(),
    })),
  };
};

export const dbClientUserAdapter = (dbObject: DBClientType<User>): User => {
  const { accountId, ...partiallyDBObjectRest } = dbClientAdapter(dbObject);

  return {
    ...partiallyDBObjectRest,
    accountId: accountId.toString(),
  };
};

export const dbClientAccountAdapter = (
  dbObject: DBClientType<Account & { userId: BSON.ObjectId }>
): Account => {
  const {
    settingsId,
    userId: _,
    ...partiallyDBObjectRest
  } = dbClientAdapter(dbObject);

  return {
    ...partiallyDBObjectRest,
    settingsId: settingsId.toString(),
  };
};

export const dbClientLegalAdapter = (dbObject: DBClientType<Legal>): Legal => {
  const { ...partiallyDBObjectRest } = dbClientAdapter(dbObject);

  return {
    ...partiallyDBObjectRest,
  };
};

/** Client => DB */
type DBProfileObjectId = { userId: BSON.ObjectId };
export const clientDBProfileAdapter = (
  dbObject: Profile
): DBClientType<Profile, DBProfileObjectId> => {
  const { userId } = dbObject;
  const dbClientProfile = clientDBAdapter<Profile, DBProfileObjectId>(dbObject);

  return {
    ...dbClientProfile,
    userId: new BSON.ObjectId(userId),
  };
};
