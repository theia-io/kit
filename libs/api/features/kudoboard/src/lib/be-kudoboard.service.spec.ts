import { Test } from '@nestjs/testing';
import { BeKudoboardService } from './be-kudoboard.service';

describe('BeKudoboardService', () => {
  let service: BeKudoboardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeKudoboardService],
    }).compile();

    service = module.get(BeKudoboardService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
