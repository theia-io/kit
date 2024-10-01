import { Injectable, InjectionToken } from '@angular/core';
import { S3Client } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

export interface S3Config {
  region: string;
  identityPoolId: string;
  //
  profileBucket: string;
  //
  farewellBucket: string;
}

export const S3_PROFILE_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_PROFILE_BUCKET_BASE_URL');

export const S3_FAREWELL_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_FAREWELL_BUCKET_BASE_URL');

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  client = new S3Client({
    region: 'eu-north-1',
    credentials: fromCognitoIdentityPool({
      identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
      clientConfig: {
        region: 'eu-north-1',
      },
    }),
  });
}
