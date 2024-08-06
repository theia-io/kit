import { Account, Legal, Profile, User } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';
import { BSON } from 'realm-web';

export const dbClientProfileAdapter = (
  dbObject: DBClientType<Profile>
): Profile => {
  const { userId, following, followers, ...partiallyDBObjectRest } =
    dbClientAdapter(dbObject) as any;

  if (following) {
    partiallyDBObjectRest.following =
      following?.map((follow: any) => follow.toString()) ?? [];
  }

  if (followers) {
    partiallyDBObjectRest.followers =
      followers?.map((follower: any) => follower.toString()) ?? [];
  }

  return {
    ...partiallyDBObjectRest,
  } as Profile;
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
