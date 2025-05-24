import { Test } from '@nestjs/testing';
import { BeExpOffboardingsController } from './be-exp-offboardings.controller';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';

describe('BeExpOffboardingsController', () => {
  let controller: BeExpOffboardingsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeExpOffboardingsService],
      controllers: [BeExpOffboardingsController],
    }).compile();

    controller = module.get(BeExpOffboardingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
