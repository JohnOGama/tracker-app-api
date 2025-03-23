import { Test, TestingModule } from '@nestjs/testing';
import { UtangService } from './utang.service';

describe('UtangService', () => {
  let service: UtangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtangService],
    }).compile();

    service = module.get<UtangService>(UtangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
