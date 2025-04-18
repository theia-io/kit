// In theory this should never be used due to project's JSON configuration.
import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

export const environment: Environment = {
  api: {
    // locally proxied to localhost:3000 ran by `npm run serve:api-hmr`
    root: '/api',
    media: '/api/media',
    auth: '/api/auth',
    kit: '/api/kit',
    tweets: '/api/tweets',
    retweets: '/api/retweets',
    bookmarks: '/api/bookmarks',
    farewell: '/api/farewell',
    farewellComments: '/api/farewell-comments',
    farewellReactions: '/api/farewell-reactions',
    farewellAnalytics: '/api/farewell-analytics',
  },
  googleTagConfig: null,
  build: KIT_ENVS.localhost,
  realmAppId: 'application-0-gwcbmrg',
  environment: KIT_ENVS.localhost,
  production: false,
  s3Config: {
    region: 'eu-north-1',
    identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
    profileBucket: 'kitouch-public-profiles-dev',
    farewellBucket: 'kitouch-public-farewell-dev',
    kudoBoardBucket: 'kitouch-public-kudoboard-dev',
  },
};
