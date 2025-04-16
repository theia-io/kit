import { Bookmark, Tweety } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';

export const dbClientTweetAdapter = (
  dbObject: DBClientType<Tweety>
): Tweety => {
  const { profileId, tweetId, retweetedProfileId, ...partiallyDBObjectRest } =
    dbClientAdapter(dbObject) as any;

  if (profileId) {
    partiallyDBObjectRest.profileId = profileId.toString();
  }

  if (tweetId) {
    partiallyDBObjectRest.tweetId = tweetId.toString();
  }

  if (retweetedProfileId) {
    partiallyDBObjectRest.retweetedProfileId = retweetedProfileId.toString();
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
