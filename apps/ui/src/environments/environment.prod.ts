import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

const version = process.env['PACKAGE_VERSION'];
const uiVersion = process.env['UI_VERSION'];
const cmdVersion = process.env['version'];

console.log(
  `\n\nversion: ${version}, uiVersion: ${uiVersion}, cmdVersion: ${cmdVersion}`
);

export const environment: Environment = {
  api: {
    root: '/api',
    media: '/media',
  },
  googleTagConfig: '${GOOGLE_TAG_ID}' || 'G-7YL998B39Q',
  build: KIT_ENVS.production + '-' + (version ?? 'N/A'),
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
