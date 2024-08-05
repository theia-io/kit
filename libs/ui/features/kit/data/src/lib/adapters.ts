import { Profile } from '@kitouch/shared-models';
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
