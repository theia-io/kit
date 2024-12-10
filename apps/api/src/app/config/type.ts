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

export type EnvConfig = {
  folder: string;
  // S3
  s3Config: S3Config;
};

export class ConfigOptionsToken {}
