import { Test } from '@nestjs/testing';
import { BeKudoboardController } from './be-kudoboard.controller';
import { BeKudoboardService } from './be-kudoboard.service';

describe('BeKudoboardController', () => {
  let controller: BeKudoboardController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeKudoboardService],
      controllers: [BeKudoboardController],
    }).compile();

    controller = module.get(BeKudoboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
