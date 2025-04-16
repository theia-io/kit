import { KitTimestamp } from '@kitouch/shared-models';

export const sortByCreatedTimeDesc = (
  aCreatedAt: KitTimestamp['createdAt'],
  bCreatedAt: KitTimestamp['createdAt']
) => new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
