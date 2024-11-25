import { inject, Injectable } from '@angular/core';
import { S3Service } from './s3.service';

@Injectable({
  providedIn: 'root',
})
export class MediaStorageService {
  #s3Service = inject(S3Service);
}
