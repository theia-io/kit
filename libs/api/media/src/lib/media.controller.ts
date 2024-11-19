import { Controller, Get, Post } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  helloWorld() {
    return { message: 'Hello Media API 3' };
  }

  @Post('kudoboard')
  saveKudoboardMedia() {}

  @Post('farewell')
  saveFarewellMedia() {}

  @Post('profile')
  saveProfileMedia() {}
}
