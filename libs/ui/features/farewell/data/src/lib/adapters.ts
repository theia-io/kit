import { Farewell } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';

export const dbClientFarewellAdapter = (
  dbObject: DBClientType<Farewell>
): Farewell => {
  return dbClientAdapter(dbObject);
};
