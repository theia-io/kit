import { Tweety } from '@kitouch/shared/models';

export const tweetIsLikedByProfile = (tweet: Tweety, profileId: string) =>
  tweet.upProfileIds?.some((upProfileId) => upProfileId === profileId);
