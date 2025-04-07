import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

export const environment: Environment = {
  api: {
    root: '/api',
    media: '/api/media',
    auth: '/api/auth',
    kit: '/api/kit',
    tweet: '/api/tweets',
    bookmarks: '/api/bookmarks',
  },
  googleTagConfig: 'G-7YL998B39Q',
  build: KIT_ENVS.production + '-5-' + '$AWS_COMMIT_ID',
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
