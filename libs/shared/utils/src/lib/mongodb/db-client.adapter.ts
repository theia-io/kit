import * as Realm from 'realm';
import { BSON } from 'realm-web';

export type DBClientType<T> = Omit<T, 'id'> &
  Realm.Services.MongoDB.Document &
  Partial<{ timestamp: { createdAt: unknown; updatedAt: unknown } }>;
export type ClientType<T> = Omit<T, '_id'> & { id: string };

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

export const clientDBAdapter = <T>(
  dbObject: ClientType<T>
): DBClientType<T> => {
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
