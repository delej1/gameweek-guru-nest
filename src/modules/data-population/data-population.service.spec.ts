import { Test, TestingModule } from '@nestjs/testing';
import { DataPopulationService } from './data-population.service';

describe('DataPopulationService', () => {
  let service: DataPopulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPopulationService],
    }).compile();

    service = module.get<DataPopulationService>(DataPopulationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
