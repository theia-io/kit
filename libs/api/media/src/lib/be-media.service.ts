import { S3ApiService } from '@kitouch/aws';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  constructor(private s3ApiService: S3ApiService) {}

  async upload({
    bucket,
    filePath,
    file,
    fileType,
  }: {
    bucket: string;
    filePath: string;
    file: Buffer;
    fileType: string;
  }) {
    let avif;

    try {
      const avifAsync = sharp(file).avif().toBuffer();
      avif = await avifAsync;
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException(
        'error while optimizing the image',
      );
    }

    const filePathWithoutExtension = filePath.replace(`.${fileType}`, ''),
      // webpFilePath = `${filePathWithoutExtension}.webp`,
      avifFilePath = `${filePathWithoutExtension}.avif`;

    try {
      const avifUploadAsync = this.s3ApiService.upload(
        bucket,
        avifFilePath,
        avif,
      );

      const defaultUploadAsync = this.s3ApiService.upload(
        bucket,
        filePath,
        file,
      );

      await Promise.all([avifUploadAsync, defaultUploadAsync]);
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException(
        'Error while uploading optimized images to storage',
      );
    }

    return {
      url: filePath,
      optimizedUrls: [avifFilePath],
    };
  }

  async delete(bucket: string, url: string) {
    try {
      return this.s3ApiService.delete(bucket, url);
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException('error removing image');
    }
  }
}
