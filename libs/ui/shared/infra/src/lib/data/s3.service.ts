import { Injectable, InjectionToken } from '@angular/core';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { from } from 'rxjs';

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

export const S3_PROFILE_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_PROFILE_BUCKET_BASE_URL');

export const S3_FAREWELL_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_FAREWELL_BUCKET_BASE_URL');

export const S3_KUDOBOARD_BUCKET_BASE_URL: InjectionToken<string> =
  new InjectionToken('S3_KUDOBOARD_BUCKET_BASE_URL');

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

  getBucketItem(Bucket: string, Key: string) {
    return from(
      this.client.send(
        new GetObjectCommand({
          Bucket,
          Key,
        })
      )
    );
  }

  setBucketItem(Bucket: string, Key: string, Body: Blob) {
    return from(
      this.client.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
        })
      )
    );
  }

  deleteBucketItem(Bucket: string, Key: string) {
    return from(
      this.client.send(
        new DeleteObjectCommand({
          Bucket,
          Key,
        })
      )
    );
  }
}
