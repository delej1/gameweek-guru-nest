import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FplModule } from '../fpl/fpl.module';
import { DataPopulationService } from './data-population.service';
import { DataPopulationResolver } from './data-population.resolver';
import { PlayerPredictionModule } from '../player-prediction/player-prediction.module';
import { MatchPredictionModule } from '../match-prediction/match-prediction.module';

@Module({
  imports: [PrismaModule, FplModule, PlayerPredictionModule, MatchPredictionModule],
  providers: [DataPopulationService, DataPopulationResolver],
  exports: [DataPopulationService],
})
export class DataPopulationModule {}
