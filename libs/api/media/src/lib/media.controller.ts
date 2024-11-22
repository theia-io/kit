import { RawBodyInterceptor } from '@kitouch/infra';
import { ContractUploadedMedia } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import imageSize from 'image-size';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('kudoboard')
  async saveKudoboardMedia(@Query('name') name: string, @Body() media: Buffer) {
    console.log(name, media);
  }

  @Post('farewell')
  @UseInterceptors(new RawBodyInterceptor())
  async saveFarewellMedia(
    @Query('name') name: string,
    @Body() media: Buffer
  ): Promise<ContractUploadedMedia> {
    const dimensions = this.#getDimensions(media);
    const { url, optimizedUrls } = await this.mediaService.upload({
      bucket: 'kitouch-public-farewell',
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
    await this.mediaService.delete('kitouch-public-farewell', url);
    return true;
  }

  @Post('profile')
  async saveProfileMedia(@Query('name') name: string, @Body() media: Buffer) {
    console.log(name, media);
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
