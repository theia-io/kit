import { Account, Profile, User } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';

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
  const { ...partiallyDBObjectRest } = dbClientAdapter(dbObject);

  return {
    ...partiallyDBObjectRest,
  };
};

export const dbClientAccountAdapter = (
  dbObject: DBClientType<Account>
): Account => {
  const { ...partiallyDBObjectRest } = dbClientAdapter(dbObject);

  return {
    ...partiallyDBObjectRest,
  };
};
