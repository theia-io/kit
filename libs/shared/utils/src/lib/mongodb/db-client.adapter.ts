import { KitTimestamp } from '@kitouch/shared-models';
import * as Realm from 'realm';
import { BSON } from 'realm-web';

type KitTimestampObj = { timestamp: KitTimestamp };

// can be `K extends keyof T`?
/** @deprecated see latest usage of `ClientDBFarewellAnalyticsRequest` and `ClientDBFarewellAnalyticsResponse` */
export type DBClientType<T, K = {}> = Omit<T, 'id' | keyof T> &
  Realm.Services.MongoDB.Document &
  K &
  Partial<KitTimestampObj>;

export type ClientType<T> = Omit<T, '_id'>; // ID - should come from T itself & { id: string };
export type DBType<T> = Omit<T, 'id'> & Realm.Services.MongoDB.Document['_id'];

// export type ClientDBRequestPartialType<T> = Omit<
//   T,
//   'id' | keyof KitTimestampObj
// >;
export type ClientDataType<T> = Omit<T, 'id' | keyof KitTimestampObj>;
export type ClientDBRequestType<T, K = {}> = Omit<T, 'id' | keyof K> &
  K &
  KitTimestampObj;
export type DbClientResponseType<T> = Omit<T, 'id'> &
  Realm.Services.MongoDB.Document['_id'];

export const clientDBGenerateTimestamp = (): KitTimestampObj => {
  const now = new Date(Date.now());

  return {
    timestamp: {
      createdAt: new Date(Date.now()),
    },
  };
};

export const dbClientAdapter = <T>(
  dbObject: DBClientType<T>
): ClientType<T> => {
  const { _id, timestamp, ...rest } = dbObject;
  const objRest: any = { ...rest };

  if (timestamp) {
    objRest.timestamp = {
      createdAt: timestamp.createdAt?.toString(),
      updatedAt: timestamp.updatedAt?.toString(),
    } as any;
  }

  return {
    ...objRest,
    id: _id.toString(),
  } as ClientType<T>;
};

export const clientDBAdapter = <T extends { id: string }, K = {}>(
  dbObject: T
): DBClientType<Omit<T, keyof K>> => {
  const { id, ...rest } = dbObject;
  return {
    ...rest,
    _id: new BSON.ObjectId(id),
  } as DBClientType<T>;
};

export const clientDBIdAdapter = (
  id: string
): Realm.Services.MongoDB.Document['_id'] => {
  return new BSON.ObjectId(id);
};
