import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

export const environment: Environment = {
  googleTagConfig: '${GOOGLE_TAG_ID}' || 'G-7YL998B39Q',
  build: KIT_ENVS.production + '-' + ('${COMMIT_SHA}' || ''),
  realmAppId: 'application-0-gnmmqxd',
  environment: KIT_ENVS.production,
  production: true,
};
