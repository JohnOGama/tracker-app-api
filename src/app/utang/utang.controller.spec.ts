import { Test, TestingModule } from '@nestjs/testing';
import { UtangController } from './utang.controller';

describe('UtangController', () => {
  let controller: UtangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtangController],
    }).compile();

    controller = module.get<UtangController>(UtangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
