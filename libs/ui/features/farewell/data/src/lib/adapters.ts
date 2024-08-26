import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import { ClientDBRequestType, dbClientAdapter, DBType } from '@kitouch/utils';
import { BSON } from 'realm-web';

/** Farewell */
export type ClientDBFarewellRequest = ClientDBRequestType<Farewell>;
export type ClientDBFarewellResponse = DBType<ClientDBFarewellRequest>;

export const dbClientFarewellAdapter = (
  dbObject: ClientDBFarewellResponse
): Farewell => {
  return dbClientAdapter<Farewell>(dbObject);
};

/** Media */

/** Analytics */
export type ClientDBFarewellAnalyticsRequest = ClientDBRequestType<
  FarewellAnalytics,
  { farewellId: BSON.ObjectId }
>;
export type ClientDBFarewellAnalyticsResponse =
  DBType<ClientDBFarewellAnalyticsRequest>;

export const dbClientFarewellAnalyticsAdapter = (
  dbObject: ClientDBFarewellAnalyticsResponse
): FarewellAnalytics => {
  const { farewellId, ...rest } = dbClientAdapter<FarewellAnalytics>(dbObject);
  return {
    ...rest,
    farewellId: farewellId.toString(),
  };
};
