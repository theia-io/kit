import { InjectionToken } from '@angular/core';

export interface S3Config {
  region: string;
  //
  profileBucket: string;
  //
  farewellBucket: string;
  //
  kudoBoardBucket: string;
}

// TODO Refactor so this is done on BE when uploading media
export const S3_PROFILE_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_PROFILE_BUCKET_BASE_URL');

// TODO Refactor so this is done on BE when uploading media
export const S3_FAREWELL_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_FAREWELL_BUCKET_BASE_URL');

// TODO Refactor so this is done on BE when uploading media
export const S3_KUDOBOARD_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_KUDOBOARD_BUCKET_BASE_URL');
