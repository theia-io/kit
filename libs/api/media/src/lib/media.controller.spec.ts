import { Test } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

describe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MediaService],
      controllers: [MediaController],
    }).compile();

    controller = module.get(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
