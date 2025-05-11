import { inject, Injectable } from '@angular/core';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root',
})
export class MediaStorageService {
  // @Dan please provide insights on why this is needed
  // eslint-disable-next-line
  #s3Service = inject(S3Service);
}
