import { Test } from '@nestjs/testing';
import { BeExpOffboardingsService } from './be-exp-offboardings.service';

describe('BeExpOffboardingsService', () => {
  let service: BeExpOffboardingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeExpOffboardingsService],
    }).compile();

    service = module.get(BeExpOffboardingsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
