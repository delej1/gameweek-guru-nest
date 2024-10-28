import { Test, TestingModule } from '@nestjs/testing';
import { MatchPredictionResolver } from './match-prediction.resolver';

describe('MatchPredictionResolver', () => {
  let resolver: MatchPredictionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchPredictionResolver],
    }).compile();

    resolver = module.get<MatchPredictionResolver>(MatchPredictionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
