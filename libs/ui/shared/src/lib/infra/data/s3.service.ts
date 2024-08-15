import { Injectable } from '@angular/core';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  #client = new S3Client({ region: 'eu-north-1' });
}
