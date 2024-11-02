import { Resolver, Query } from '@nestjs/graphql';
import { MatchPredictionService } from './match-prediction.service';
import { MatchPrediction } from './match-prediction.model';

@Resolver()
export class MatchPredictionResolver {
    constructor(private readonly matchPredictionService: MatchPredictionService) {}

  @Query(() => [MatchPrediction])
  async getMatchPredictionsForCurrentGameWeek() {
    return this.matchPredictionService.getMatchPredictionsForGameWeek();
  }
}