import { RawBodyInterceptor } from '@kitouch/infra';
import { ConfigService } from '@kitouch/be-config';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import imageSize from 'image-size';
import { MediaService } from './be-media.service';

@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private configService: ConfigService
  ) {}

  @Post('kudoboard')
  @UseInterceptors(new RawBodyInterceptor())
  async saveKudoboardMedia(@Query('name') name: string, @Body() media: Buffer) {
    const dimensions = this.#getDimensions(media);
    const { url, optimizedUrls } = await this.mediaService.upload({
      bucket: this.configService.getConfig('s3').kudoBoardBucket,
      file: media,
      filePath: name,
      fileType: dimensions.type ?? name.split('.').reverse()[0],
    });

    const { height, width } = dimensions;
    return {
      height,
      width,
      url,
      optimizedUrls,
    };
  }

  @Delete('kudoboard')
  async deleteKudoBoardMedia(@Query('name') url: string): Promise<boolean> {
    await this.mediaService.delete(
      this.configService.getConfig('s3').kudoBoardBucket,
      url
    );
    return true;
  }

  @Post('farewell')
  @UseInterceptors(new RawBodyInterceptor())
  async saveFarewellMedia(
    @Query('name') name: string,
    @Body() media: Buffer
  ): Promise<ContractUploadedMedia> {
    const dimensions = this.#getDimensions(media);
    const { url, optimizedUrls } = await this.mediaService.upload({
      bucket: this.configService.getConfig('s3').farewellBucket,
      file: media,
      filePath: name,
      fileType: dimensions.type ?? name.split('.').reverse()[0],
    });

    const { height, width } = dimensions;
    return {
      height,
      width,
      url,
      optimizedUrls,
    };
  }

  @Delete('farewell')
  async deleteFarewellMedia(@Query('name') url: string): Promise<boolean> {
    await this.mediaService.delete(
      this.configService.getConfig('s3').farewellBucket,
      url
    );
    return true;
  }

  @Post('profile')
  @UseInterceptors(new RawBodyInterceptor())
  async saveProfileMedia(@Query('name') name: string, @Body() media: Buffer) {
    const dimensions = this.#getDimensions(media);
    const { url, optimizedUrls } = await this.mediaService.upload({
      bucket: this.configService.getConfig('s3').profileBucket,
      file: media,
      filePath: name,
      fileType: dimensions.type ?? name.split('.').reverse()[0],
    });

    const { height, width } = dimensions;
    return {
      height,
      width,
      url,
      optimizedUrls,
    };
  }

  #getDimensions(media: Buffer) {
    try {
      return imageSize(media);
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException(
        'Error while getting image dimensions'
      );
    }
  }
}
