import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3ApiService {
  #client = new S3Client({
    region: 'eu-north-1',
    credentials: fromCognitoIdentityPool({
      identityPoolId: 'eu-north-1:0d7df556-9796-4d53-8387-aed1c71f8aec',
      clientConfig: {
        region: 'eu-north-1',
      },
    }),
  });

  async upload(bucket: string, url: string, file: Buffer) {
    return this.#client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: url,
        Body: file,
      }),
    );
  }

  async delete(bucket: string, url: string) {
    return this.#client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: url,
      }),
    );
  }
}
