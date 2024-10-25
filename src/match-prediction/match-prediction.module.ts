import { Module } from '@nestjs/common';
import { MatchPredictionService } from './match-prediction.service';
import { AnthropicModule } from '../anthropic/anthropic.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FplModule } from '../fpl/fpl.module';

@Module({
  imports: [PrismaModule, AnthropicModule, FplModule],
  providers: [MatchPredictionService],
  exports: [MatchPredictionService],
})
export class MatchPredictionModule {}
