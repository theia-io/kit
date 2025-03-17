import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Farewell } from '@kitouch/shared-models';

export const farewellLink = (origin: string, farewellId: Farewell['id']) =>
  [origin, 's', APP_PATH_ALLOW_ANONYMOUS.Farewell, farewellId].join('/');
