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

export const S3_PROFILE_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_PROFILE_BUCKET_BASE_URL');

export const S3_FAREWELL_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_FAREWELL_BUCKET_BASE_URL');

export const S3_KUDOBOARD_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_KUDOBOARD_BUCKET_BASE_URL');
