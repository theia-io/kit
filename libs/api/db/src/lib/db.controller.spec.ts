import { Test } from '@nestjs/testing';
import { DbController } from './db.controller';

describe('DbController', () => {
  let controller: DbController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [DbController],
    }).compile();

    controller = module.get(DbController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
