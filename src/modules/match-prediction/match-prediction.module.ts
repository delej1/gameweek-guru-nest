import { Module } from '@nestjs/common';
import { MatchPredictionService } from './match-prediction.service';
import { AnthropicModule } from '../../anthropic/anthropic.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { FplModule } from '../fpl/fpl.module';
import { MatchPredictionResolver } from './match-prediction.resolver';

@Module({
  imports: [PrismaModule, AnthropicModule, FplModule],
  providers: [MatchPredictionService, MatchPredictionResolver],
  exports: [MatchPredictionService],
})
export class MatchPredictionModule {}
