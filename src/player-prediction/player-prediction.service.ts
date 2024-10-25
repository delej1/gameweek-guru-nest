import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnthropicAiService } from '../anthropic/anthropic.service';
import { FplDataService } from '../fpl/fpl.service';

@Injectable()
export class PlayerPredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fplDataService: FplDataService,
    private readonly anthropicAiService: AnthropicAiService,
  ) {}

  async generatePlayerPredictions(): Promise<void> {
    const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

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
      const prompt = `Predict the PL performance of the following player in the next game:
      - Name: ${player.name}
      - Position: ${player.position}
      - Form: ${player.form}
      - Total Points: ${player.totalPoints}
      - Goals Scored: ${player.goalsScored}
      - Assists: ${player.assists}
      - Clean Sheets: ${player.cleanSheets}
      - Opponent: ${opponentTeam.name}
      - Opponent Strength: ${opponentTeam.strengthOverall}
      Please provide:
      - Predicted FPL points for the next game
      - Probability of scoring goals (in percentage)
      - Probability of assisting (in percentage)
      - Confidence level for this prediction (in percentage)`;

      // Call Anthropic to get the prediction
      const prediction = await this.anthropicAiService.generatePrediction(prompt);

      // Log the prediction to the console for testing purposes
      console.log(`Prediction for Player: ${player.name}`);
      console.log(`Anthropic Response: ${prediction}`);
      console.log('------------------------------------');
    }
  }
}
