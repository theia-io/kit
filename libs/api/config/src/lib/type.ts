export interface Environment {
  production: boolean;
  version: string;
  baseUrl: string;
  apiPrefix: string;
  feUrl: string;
}
export class EnvironmentToken {}

export type envkeys = keyof Environment;

export interface Config {
  // DB
  atlasUri: string;
  // S3
  s3: S3Config;
  // Auth0
  auth: Auth0Config;
  // sec
  csrfSec: string;
}
//
export interface S3Config {
  region: string;
  identityPoolId: string;
  //
  profileBucket: string;
  //
  farewellBucket: string;
  //
  kudoBoardBucket: string;
}
export interface Auth0Config {
  issuerBaseUrl: string;
  clientId: string;
  clientSecret: string;
  authSecret: string;
  jwtSecret: string;
  sessionSecret: string;
}
