import { Bookmark, Tweety } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';

export const dbClientTweetAdapter = (
  dbObject: DBClientType<Tweety>
): Tweety => {
  const {
    profileId,
    referenceId,
    referenceProfileId,
    ...partiallyDBObjectRest
  } = dbClientAdapter(dbObject) as any;

  if (profileId) {
    partiallyDBObjectRest.profileId = profileId.toString();
  }

  if (referenceId) {
    partiallyDBObjectRest.referenceId = referenceId.toString();
  }

  if (referenceProfileId) {
    partiallyDBObjectRest.referenceProfileId = referenceProfileId.toString();
  }

  return {
    ...partiallyDBObjectRest,
  } as Tweety;
};

export const dbClientBookmarkAdapter = (
  dbObject: DBClientType<Bookmark>
): Bookmark => {
  const {
    tweetId,
    profileIdTweetyOwner,
    profileIdBookmarker,
    ...partiallyDBObjectRest
  } = dbClientAdapter(dbObject) as any;

  if (tweetId) {
    partiallyDBObjectRest.tweetId = tweetId.toString();
  }

  if (profileIdTweetyOwner) {
    partiallyDBObjectRest.profileIdTweetyOwner =
      profileIdTweetyOwner.toString();
  }

  if (profileIdBookmarker) {
    partiallyDBObjectRest.profileIdBookmarker = profileIdBookmarker.toString();
  }

  return {
    ...partiallyDBObjectRest,
  } as Bookmark;
};
