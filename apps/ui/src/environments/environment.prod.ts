import { Environment, KIT_ENVS } from '@kitouch/shared-infra';

const version = '${PACKAGE_VERSION}';
const version2 = '${{ PACKAGE_VERSION }}';
const uiVersion = '${UI_VERSION}';
const uiVersion2 = '${ UI_VERSION }';
const cmdVersion = '${version}';
const cmdVersion2 = '${{version}}';

console.log(
  `\n\nversion: ${version}, uiVersion: ${uiVersion}, cmdVersion: ${cmdVersion}`
);

export const environment: Environment & { test: any } = {
  test: {
    version,
    version2,
    uiVersion,
    uiVersion2,
    cmdVersion,
    cmdVersion2,
    testVariable: '${{ API_BASE }} ',
  },
  api: {
    root: '/api',
    media: '/media',
  },
  googleTagConfig: '${GOOGLE_TAG_ID}' || 'G-7YL998B39Q',
  build:
    KIT_ENVS.production + '-' + (version ?? uiVersion ?? cmdVersion ?? 'N/A'),
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
