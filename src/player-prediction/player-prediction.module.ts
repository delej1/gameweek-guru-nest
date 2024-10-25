import { Module } from '@nestjs/common';
import { PlayerPredictionService } from './player-prediction.service';
import { AnthropicModule } from '../anthropic/anthropic.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FplModule } from '../fpl/fpl.module';
import { PlayerPredictionResolver } from './player-prediction.resolver';

@Module({
  imports: [PrismaModule, AnthropicModule, FplModule],
  providers: [PlayerPredictionService, PlayerPredictionResolver],
  exports: [PlayerPredictionService],
})
export class PlayerPredictionModule {}