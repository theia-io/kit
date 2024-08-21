import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import { dbClientAdapter, DBClientType } from '@kitouch/utils';

export const dbClientFarewellAdapter = (
  dbObject: DBClientType<Farewell>
): Farewell => {
  return dbClientAdapter(dbObject);
};

export const dbClientFarewellAnalyticsAdapter = (
  dbObject: DBClientType<FarewellAnalytics>
): FarewellAnalytics => {
  const { farewellId, ...rest } = dbClientAdapter(dbObject);
  return {
    ...rest,
    farewellId: farewellId.toString(),
  };
};
