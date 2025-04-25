import { Test } from '@nestjs/testing';
import { BeBookmarksService } from './be-bookmarks.service';

describe('BeBookmarksService', () => {
  let service: BeBookmarksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeBookmarksService],
    }).compile();

    service = module.get(BeBookmarksService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
