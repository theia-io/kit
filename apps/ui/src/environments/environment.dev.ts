// In theory this should never be used due to project's JSON configuration.
import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

export const environment: Environment = {
  api: {
    // locally proxied to localhost:3000 ran by `npm run serve:api-hmr`
    root: 'https://apidev.kitouch.io/api',
    media: 'https://apidev.kitouch.io/api/media',
    auth: 'https://apidev.kitouch.io/api/auth',
    kit: 'https://apidev.kitouch.io/api/kit',
    tweets: 'https://apidev.kitouch.io/api/tweets',
    retweets: 'https://apidev.kitouch.io/api/retweets',
    bookmarks: 'https://apidev.kitouch.io/api/bookmarks',
    farewells: 'https://apidev.kitouch.io/api/farewells',
    farewellComments: 'https://apidev.kitouch.io/api/farewell-comments',
    farewellReactions: 'https://apidev.kitouch.io/api/farewell-reactions',
    farewellAnalytics: 'https://apidev.kitouch.io/api/farewell-analytics',
    kudoboards: 'https://apidev.kitouch.io/api/kudoboards',
    kudoboardComments: 'https://apidev.kitouch.io/api/kudoboard-comments',
    kudoboardReactions: 'https://apidev.kitouch.io/api/kudoboard-reactions',
    kudoboardAnalytics: 'https://apidev.kitouch.io/api/kudoboard-analytics',
  },
  googleTagConfig: null,
  build: `${KIT_ENVS.development}-7.0.21-722fe5d5`,
  environment: KIT_ENVS.development,
  production: true,
  s3Config: {
    region: 'eu-north-1',
    profileBucket: 'kitouch-public-profiles-dev',
    farewellBucket: 'kitouch-public-farewell-dev',
    kudoBoardBucket: 'kitouch-public-kudoboard-dev',
  },
};
