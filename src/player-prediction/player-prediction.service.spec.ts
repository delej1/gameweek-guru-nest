import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPredictionService } from './player-prediction.service';

describe('PlayerPredictionService', () => {
  let service: PlayerPredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPredictionService],
    }).compile();

    service = module.get<PlayerPredictionService>(PlayerPredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
