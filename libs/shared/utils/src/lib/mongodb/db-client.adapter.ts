import { KitTimestamp } from '@kitouch/shared-models';

type KitTimestampObj = { timestamp: KitTimestamp };

export type ClientDataType<T> = Omit<
  T,
  'id' | keyof KitTimestampObj | keyof KitTimestamp
>;

export const getNow = () => new Date(Date.now());
