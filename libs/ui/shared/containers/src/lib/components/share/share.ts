import { APP_PATH_ALLOW_ANONYMOUS } from '@kitouch/shared-constants';
import { Farewell, KudoBoard } from '@kitouch/shared-models';

export const farewellLink = (origin: string, farewellId: Farewell['id']) =>
  [origin, 's', APP_PATH_ALLOW_ANONYMOUS.Farewell, farewellId].join('/');

export const kudoboardLink = (
  origin: string,
  kudoboardId: KudoBoard['id'],
  gifting: boolean
) =>
  [origin, 's', APP_PATH_ALLOW_ANONYMOUS.KudoBoard, kudoboardId].join('/') +
  (gifting ? '?view=true' : '');
