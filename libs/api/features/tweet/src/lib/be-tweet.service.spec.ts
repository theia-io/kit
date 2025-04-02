import { Test } from '@nestjs/testing';
import { BeTweetService } from './be-tweet.service';

describe('BeTweetService', () => {
  let service: BeTweetService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeTweetService],
    }).compile();

    service = module.get(BeTweetService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
