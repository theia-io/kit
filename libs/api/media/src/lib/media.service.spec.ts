import { Test } from '@nestjs/testing';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MediaService],
    }).compile();

    service = module.get(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
