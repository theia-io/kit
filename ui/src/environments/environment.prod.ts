import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

export const environment: Environment = {
  build: `${KIT_ENVS.production}-${process.env?.['COMMIT_SHA'] ?? 'N/A'}`,
  realmAppId: 'application-0-gnmmqxd',
  environment: KIT_ENVS.production,
  production: true,
};
