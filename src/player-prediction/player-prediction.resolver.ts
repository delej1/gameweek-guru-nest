import { Resolver, Query } from '@nestjs/graphql';
import { PlayerPredictionService } from './player-prediction.service';
import { PlayerPrediction } from './player-prediction.model';

@Resolver()
export class PlayerPredictionResolver {
  constructor(private readonly playerPredictionService: PlayerPredictionService) {}

  @Query(() => [PlayerPrediction])
  async getPlayerPredictionsForCurrentGameWeek() {
    return this.playerPredictionService.getPlayerPredictionsForGameWeek();
  }
}
