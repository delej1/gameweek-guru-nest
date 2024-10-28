import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPredictionResolver } from './player-prediction.resolver';

describe('PlayerPredictionResolver', () => {
  let resolver: PlayerPredictionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPredictionResolver],
    }).compile();

    resolver = module.get<PlayerPredictionResolver>(PlayerPredictionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
