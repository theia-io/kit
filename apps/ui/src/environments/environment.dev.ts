import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

export const environment: Environment = {
  googleTagConfig: null,
  build: `${KIT_ENVS.development}-${'N/A'}`,
  realmAppId: 'application-0-gwcbmrg',
  environment: KIT_ENVS.localhost,
  production: true,
  s3Config: {
    region: 'eu-north-1',
    identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
    profileBucket: 'kitouch-public-profiles',
  },
};
