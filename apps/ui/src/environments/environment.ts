import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

// In theory this should never be used due to project's JSON configuration.
/** @TODO verify this is correct */
console.error('This should has not be called ts-d8123S-Ad');

export const environment: Environment = {
  api: {
    root: '/api',
    media: '/media',
  },
  googleTagConfig: null,
  build: `${KIT_ENVS.localhost}-${'localhost'}`,
  realmAppId: 'application-0-gwcbmrg',
  environment: KIT_ENVS.localhost,
  production: false,
  s3Config: {
    region: 'eu-north-1',
    identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
    profileBucket: 'kitouch-public-profiles',
    farewellBucket: 'kitouch-public-farewell',
    kudoBoardBucket: 'kitouch-public-kudoboard',
  },
};
