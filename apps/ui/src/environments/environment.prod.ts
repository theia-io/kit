import { Environment, KIT_ENVS } from '@kitouch/ui-shared';

export const environment: Environment = {
  api: {
    root: '/api',
    media: '/media',
  },
  googleTagConfig: '${GOOGLE_TAG_ID}' || 'G-7YL998B39Q',
  build: KIT_ENVS.production + '-' + 'v0.0.8-ddb4af2', //+ ('${COMMIT_SHA}' || ''),
  realmAppId: 'application-0-gnmmqxd',
  environment: KIT_ENVS.production,
  production: true,
  s3Config: {
    region: 'eu-north-1',
    identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
    profileBucket: 'kitouch-public-profiles',
    farewellBucket: 'kitouch-public-farewell',
    kudoBoardBucket: 'kitouch-public-kudoboard',
  },
};
