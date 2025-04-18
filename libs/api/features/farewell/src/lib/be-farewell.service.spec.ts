import { Test } from '@nestjs/testing';
import { BeFarewellService } from './be-farewell.service';

describe('BeFarewellService', () => {
  let service: BeFarewellService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeFarewellService],
    }).compile();

    service = module.get(BeFarewellService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
