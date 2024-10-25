import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnthropicAiService } from '../anthropic/anthropic.service';
import { FplDataService } from '../fpl/fpl.service';
import { validateMatchPredictionResponse } from '../helpers/prediction-validation';

@Injectable()
export class MatchPredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fplDataService: FplDataService,
    private readonly anthropicAiService: AnthropicAiService,
  ) { }

  async generateMatchPredictions(): Promise<void> {
    const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

    const unfinishedFixtures = await this.prisma.fixtures.findMany({
      where: {
        gameweek: currentGameWeek,
        finished: false,  // Ensure only unfinished matches are returned
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (unfinishedFixtures.length === 0) {
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
        Please respond with:
        - Home Win (%) = [confidence in percentage]
        - Away Win (%) = [confidence in percentage]
        - Draw (%) = [confidence in percentage]
        - Predicted Home Goals = [number]
        - Predicted Away Goals = [number]
        - Reasoning = [detailed reasoning here]`;

        try {
          // Call Anthropic to get the prediction
          const prediction = await this.anthropicAiService.generatePrediction(prompt);

          // Validate the response structure
          const validatedResponse = validateMatchPredictionResponse(prediction);

          if (!validatedResponse) {
            console.log(`Invalid response format for fixture ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`);
            continue;
          }

          // Upload validated data to the database
          await this.prisma.matchPredictions.create({
            data: {
              fixtureId: fixture.id,
              confidenceHomeWin: validatedResponse.confidenceHomeWin,
              confidenceAwayWin: validatedResponse.confidenceAwayWin,
              confidenceDraw: validatedResponse.confidenceDraw,
              predictedHomeGoals: validatedResponse.predictedHomeGoals,
              predictedAwayGoals: validatedResponse.predictedAwayGoals,
              aiReasoning: validatedResponse.reasoning,
            },
          });

          console.log(`Prediction for Fixture: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} successfully stored in the database.`);
          // Log the match prediction to the console for testing purposes
          console.log(`Prediction for Fixture: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`);
          console.log(`Anthropic Response: ${prediction}`);
          console.log('------------------------------------');

        } catch (error) {
          console.error(`Error generating prediction for ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}: ${error.message}`);
        }
      }
    } else {
      console.log(`Still ${unfinishedFixtures.length} unfinished fixtures in the current game week.`);
    }
  }

  // Fetch predictions for the relevant game week
  async getPredictionsForGameWeek(): Promise<any[]> {
    const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

    // Check if there are unfinished fixtures in the current game week
    const unfinishedFixtures = await this.prisma.fixtures.findMany({
      where: {
        gameweek: currentGameWeek,
        finished: false,
      },
    });

    let gameWeekToShow = currentGameWeek;

    // If all matches in the current game week are finished, move to the next game week
    if (unfinishedFixtures.length === 0) {
      gameWeekToShow = currentGameWeek + 1;
    }

    // Fetch predictions for the determined game week, filtering out finished fixtures
    return await this.prisma.matchPredictions.findMany({
      where: {
        fixture: {
          gameweek: gameWeekToShow,
          finished: false,
        },
      },
      include: {
        fixture: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });
  }
}
