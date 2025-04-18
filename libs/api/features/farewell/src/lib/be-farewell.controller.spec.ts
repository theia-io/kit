import { Test } from '@nestjs/testing';
import { BeFarewellController } from './be-farewell.controller';
import { BeFarewellService } from './be-farewell.service';

describe('BeFarewellController', () => {
  let controller: BeFarewellController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeFarewellService],
      controllers: [BeFarewellController],
    }).compile();

    controller = module.get(BeFarewellController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
