import { KitTimestamp } from '@kitouch/shared-models';

export const sortByCreatedTimeDesc = (
  a: { timestamp: KitTimestamp },
  b: { timestamp: KitTimestamp }
) =>
  new Date(a.timestamp?.createdAt).getTime() -
  new Date(b.timestamp?.createdAt).getTime();
