import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnthropicAiService } from '../anthropic/anthropic.service';
import { FplDataService } from '../fpl/fpl.service';
import { validatePlayerPredictionResponse } from '../helpers/prediction-validation';

@Injectable()
export class PlayerPredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fplDataService: FplDataService,
    private readonly anthropicAiService: AnthropicAiService,
  ) { }

  async generatePlayerPredictions(): Promise<void> {
    const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

    // Check for unfinished fixtures in the current game week
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

    // If all matches in the current game week are finished, proceed to the next game week
    if (unfinishedFixtures.length > 0) {
      console.log(`Still ${unfinishedFixtures.length} unfinished fixtures in the current game week ${currentGameWeek}.`);
      return; // Exit the function if there are unfinished fixtures
    }


    const players = await this.prisma.players.findMany({
      where: {
        status: "a",  // Available players
        chanceOfPlayingNextRound: { gte: 75 },  // Percentage
        form: { gte: 3.0 },
        ictIndex: { gte: 50 },
      },
      include: { team: true },
    });

    if (players.length === 0) {
      console.log("No players match the filter criteria.");
      return;
    }

    for (const player of players) {
      // Fetch the player's next fixture to check the opponent's strength
      const fixture = await this.prisma.fixtures.findFirst({
        where: {
          OR: [
            { homeTeamId: player.teamId },  // If player's team is home team
            { awayTeamId: player.teamId },  // If player's team is away team
          ],
          gameweek: currentGameWeek + 1,
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });

      // Check if the fixture exists (should belong to current gameweek)
      if (!fixture) {
        console.log(`No fixture found for ${player.name} in game week ${currentGameWeek + 1}`);
        continue;
      }

      const opponentTeam = fixture.homeTeamId === player.teamId ? fixture.awayTeam : fixture.homeTeam;
      const difficulty = fixture.homeTeamId === player.teamId ? fixture.difficultyAway : fixture.difficultyHome;
      const prompt = `Predict the Premier League performance of the following player in the next game:
      - Name: ${player.name}
      - Position: ${player.position}
      - Form: ${player.form}
      - Total Points: ${player.totalPoints}
      - Goals Scored: ${player.goalsScored}
      - Assists: ${player.assists}
      - Clean Sheets: ${player.cleanSheets}
      - Expected Goals (xG): ${player.expectedGoals}
      - Expected Assists (xA): ${player.expectedAssists}
      - Influence: ${player.influence}
      - Creativity: ${player.creativity}
      - Threat: ${player.threat}
      - ICT Index: ${player.ictIndex}
      - Minutes Played: ${player.minutes}
      - Opponent: ${opponentTeam.name}
      - Opponent Strength: ${opponentTeam.strengthOverall}
      - Fixture Difficulty: ${difficulty}
  
      Please respond with the following information in a structured format:
      - Predicted FPL Points: [predicted points in decimal]
      - Goal Scoring Probability: [percentage probability]
      - Assist Probability: [percentage probability]
      - Prediction Confidence: [percentage confidence]
      - Reasoning: [AI reasoning]`;

      try {
        // Call Anthropic to get the prediction
        const prediction = await this.anthropicAiService.generatePrediction(prompt);

        // Validate the response structure
        const validatedResponse = validatePlayerPredictionResponse(prediction);

        if (!validatedResponse) {
          console.log(`Invalid response format for player ${player.name}.`);
          continue;
        }

        // Upload validated data to the database
        await this.prisma.playerPredictions.create({
          data: {
            playerId: player.id,
            fixtureId: fixture.id,
            predictedPoints: validatedResponse.predictedPoints,
            predictedGoals: validatedResponse.predictedGoals,
            predictedAssists: validatedResponse.predictedAssists,
            predictionConfidence: validatedResponse.predictionConfidence,
            aiReasoning: validatedResponse.reasoning,
          },
        });

        console.log(`Prediction for Player: ${player.name} successfully stored in the database.`);
        // Log the prediction to the console for testing purposes
        console.log(`Prediction for Player: ${player.name}`);
        console.log(`Anthropic Response: ${prediction}`);
        console.log('------------------------------------');
      } catch (error) {
        console.error(`Error generating prediction for ${player.name}: ${error.message}`);
      }
    }
  }

  async getPlayerPredictionsForGameWeek(): Promise<any[]> {
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

    // Fetch player predictions for the determined game week
    return await this.prisma.playerPredictions.findMany({
      where: {
        fixture: {
          gameweek: gameWeekToShow,
          finished: false,
        },
      },
      include: {
        player: {
          include: {
            team: true,
          },
        },
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
