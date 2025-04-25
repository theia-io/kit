import { Test } from '@nestjs/testing';
import { BeTweetController } from './be-tweet.controller';
import { BeTweetService } from './be-tweet.service';

describe('BeTweetController', () => {
  let controller: BeTweetController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeTweetService],
      controllers: [BeTweetController],
    }).compile();

    controller = module.get(BeTweetController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
