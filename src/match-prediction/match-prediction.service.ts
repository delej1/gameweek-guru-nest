import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnthropicAiService } from '../anthropic/anthropic.service';
import { FplDataService } from '../fpl/fpl.service';

@Injectable()
export class MatchPredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fplDataService: FplDataService,
    private readonly anthropicAiService: AnthropicAiService,
  ) {}

  async generateMatchPredictions(): Promise<void> {
    const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

    const fixtures = await this.prisma.fixtures.findMany({
      where: {
        gameweek: currentGameWeek + 1,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      });

    for (const fixture of fixtures) {
      const prompt = `Predict the result of the following football match:
      - Home Team: ${fixture.homeTeam.name}
      - Away Team: ${fixture.awayTeam.name}
      - Home Team Strength: ${fixture.homeTeam.strengthOverall}
      - Away Team Strength: ${fixture.awayTeam.strengthOverall}
      - Difficulty for Home Team: ${fixture.difficultyHome}
      - Difficulty for Away Team: ${fixture.difficultyAway}
      Please provide the confidence in the following outcomes:
      - Home Win (%)
      - Away Win (%)
      - Draw (%)
      Also, predict how many goals will be scored by each team in this match:
      - Predicted goals for Home Team
      - Predicted goals for Away Team`;

      // Call Anthropic to get the prediction
      const prediction = await this.anthropicAiService.generatePrediction(prompt);

      // Log the match prediction to the console for testing purposes
      console.log(`Prediction for Fixture: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`);
      console.log(`Anthropic Response: ${prediction}`);
      console.log('------------------------------------');
    }
  }
}
