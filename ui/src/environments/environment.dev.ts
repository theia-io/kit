import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

export const environment: Environment = {
  build: `${KIT_ENVS.development}-${process.env?.['COMMIT_SHA'] ?? 'N/A'}`,
  realmAppId: 'application-0-gwcbmrg',
  environment: KIT_ENVS.localhost,
  production: true,
};
