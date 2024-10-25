import { Test, TestingModule } from '@nestjs/testing';
import { FplDataService } from './fpl.service';

describe('FplDataService', () => {
  let service: FplDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FplDataService],
    }).compile();

    service = module.get<FplDataService>(FplDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
