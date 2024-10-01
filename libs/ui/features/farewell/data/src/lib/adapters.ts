import {
  Farewell,
  FarewellAnalytics,
  FarewellMedia,
} from '@kitouch/shared-models';
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
export type ClientDBFarewellMediaRequest = ClientDBRequestType<
  FarewellMedia,
  { farewellId: BSON.ObjectId; profileId: BSON.ObjectId }
>;
export type ClientDBFarewellMediaResponse =
  DBType<ClientDBFarewellMediaRequest>;

export const dbClientFarewellMediaAdapter = (
  dbObject: ClientDBFarewellMediaResponse
): FarewellMedia => {
  const { farewellId, profileId, ...rest } =
    dbClientAdapter<FarewellMedia>(dbObject);
  return {
    ...rest,
    farewellId: farewellId.toString(),
    profileId: profileId.toString(),
  };
};

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
