import { KitTimestamp } from '@kitouch/shared-models';

type KitTimestampObj = { timestamp: KitTimestamp };

export type ClientDataType<T> = Omit<T, 'id' | keyof KitTimestampObj>;

export const getNow = () => new Date(Date.now());
