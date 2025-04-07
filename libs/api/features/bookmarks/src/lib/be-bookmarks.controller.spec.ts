import { Test } from '@nestjs/testing';
import { BeBookmarksController } from './be-bookmarks.controller';
import { BeBookmarksService } from './be-bookmarks.service';

describe('BeBookmarksController', () => {
  let controller: BeBookmarksController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BeBookmarksService],
      controllers: [BeBookmarksController],
    }).compile();

    controller = module.get(BeBookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
