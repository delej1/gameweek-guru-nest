import { Test, TestingModule } from '@nestjs/testing';
import { DataPopulationResolver } from './data-population.resolver';

describe('DataPopulationResolver', () => {
  let resolver: DataPopulationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPopulationResolver],
    }).compile();

    resolver = module.get<DataPopulationResolver>(DataPopulationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
