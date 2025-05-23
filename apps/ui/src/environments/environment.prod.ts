import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

export const environment: Environment = {
  api: {
    root: 'https://api.kitouch.io/api',
    media: 'https://api.kitouch.io/api/media',
    auth: 'https://api.kitouch.io/api/auth',
    kit: 'https://api.kitouch.io/api/kit',
    tweets: 'https://api.kitouch.io/api/tweets',
    retweets: 'https://api.kitouch.io/api/retweets',
    bookmarks: 'https://api.kitouch.io/api/bookmarks',
    farewells: 'https://api.kitouch.io/api/farewells',
    farewellComments: 'https://api.kitouch.io/api/farewell-comments',
    farewellReactions: 'https://api.kitouch.io/api/farewell-reactions',
    farewellAnalytics: 'https://api.kitouch.io/api/farewell-analytics',
    kudoboards: 'https://api.kitouch.io/api/kudoboards',
    kudoboardComments: 'https://api.kitouch.io/api/kudoboard-comments',
    kudoboardReactions: 'https://api.kitouch.io/api/kudoboard-reactions',
    kudoboardAnalytics: 'https://api.kitouch.io/api/kudoboard-analytics',
  },
  googleTagConfig: 'G-7YL998B39Q',
  // IF `SCRIPT_REPLACED_PACKAGE_VERSION` is not found make sure to add it to the `build` so that it can be auto-replaced
  build: `${KIT_ENVS.production}-{SCRIPT_REPLACED_PACKAGE_VERSION}`,
  environment: KIT_ENVS.production,
  production: true,
  s3Config: {
    region: 'eu-north-1',
    profileBucket: 'kitouch-public-profiles',
    farewellBucket: 'kitouch-public-farewell',
    kudoBoardBucket: 'kitouch-public-kudoboard',
  },
};
