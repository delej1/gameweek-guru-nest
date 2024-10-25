import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FplDataService } from '../fpl/fpl.service';
import { PlayerPredictionService } from '../player-prediction/player-prediction.service';
import { MatchPredictionService } from '../match-prediction/match-prediction.service';

@Injectable()
export class DataPopulationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fplDataService: FplDataService,
    private readonly playerPredictionService: PlayerPredictionService,
    private readonly matchPredictionService: MatchPredictionService,
  ) { }

  async populateTeams(): Promise<void> {
    const data = await this.fplDataService.fetchBootstrapData();
    const teams = data.teams;

    // Process and insert teams into the database
    for (const team of teams) {
      // Calculate overall strengths
      const overallAttackStrength = (team.strength_attack_home + team.strength_attack_away) / 2;
      const overallDefenseStrength = (team.strength_defence_home + team.strength_defence_away) / 2;
      const overallTeamStrength = (team.strength_overall_home + team.strength_overall_away) / 2;

      await this.prisma.teams.upsert({
        where: { fpl_id: team.id },
        update: {
          name: team.name,
          code: team.code,
          strengthAttack: overallAttackStrength,
          strengthDefense: overallDefenseStrength,
          strengthOverall: overallTeamStrength,
        },
        create: {
          fpl_id: team.id,
          name: team.name,
          code: team.code,
          strengthAttack: overallAttackStrength,
          strengthDefense: overallDefenseStrength,
          strengthOverall: overallTeamStrength,
        },
      });
    }
  }

  async populatePlayers(): Promise<void> {
    const data = await this.fplDataService.fetchBootstrapData();
    const players = data.elements;

    // Process and insert players into the database
    for (const player of players) {
      await this.prisma.players.upsert({
        where: { fpl_id: player.id },
        update: {
          name: player.web_name ?? "Unknown",
          code: player.code ?? 0,
          position: player.element_type ?? 0,
          totalPoints: player.total_points ?? 0,
          form: player.form ?? 0.0,
          goalsScored: player.goals_scored ?? 0,
          assists: player.assists ?? 0,
          minutes: player.minutes ?? 0,
          cleanSheets: player.clean_sheets ?? 0,
          expectedGoals: player.expected_goals ?? 0.0,
          expectedAssists: player.expected_assists ?? 0.0,
          influence: player.influence ?? 0.0,
          creativity: player.creativity ?? 0.0,
          threat: player.threat ?? 0.0,
          ictIndex: player.ict_index ?? 0.0,
          status: player.status ?? "Unavailable",
          chanceOfPlayingNextRound: player.chance_of_playing_next_round ?? 0,
          team: {
            connect: { id: player.team }
          },
        },
        create: {
          fpl_id: player.id,
          name: player.web_name ?? "Unknown",
          code: player.code ?? 0,
          position: player.element_type ?? 0,
          totalPoints: player.total_points ?? 0,
          form: player.form ?? 0.0,
          goalsScored: player.goals_scored ?? 0,
          assists: player.assists ?? 0,
          minutes: player.minutes ?? 0,
          cleanSheets: player.clean_sheets ?? 0,
          expectedGoals: player.expected_goals ?? 0.0,
          expectedAssists: player.expected_assists ?? 0.0,
          influence: player.influence ?? 0.0,
          creativity: player.creativity ?? 0.0,
          threat: player.threat ?? 0.0,
          ictIndex: player.ict_index ?? 0.0,
          status: player.status ?? "Unavailable",
          chanceOfPlayingNextRound: player.chance_of_playing_next_round ?? 0,
          team: {
            connect: { id: player.team }
          },
        },
      });
    }

    await this.playerPredictionService.generatePlayerPredictions();
  }

  async populateFixtures(): Promise<void> {
    const fixtures = await this.fplDataService.fetchFixtures();

    // Process and insert fixtures into the database
    for (const fixture of fixtures) {
      await this.prisma.fixtures.upsert({
        where: { fpl_id: fixture.id },
        update: {
          gameweek: fixture.event,
          finished: fixture.finished,
          homeTeamId: fixture.team_h,
          awayTeamId: fixture.team_a,
          date: fixture.kickoff_time,
          difficultyHome: fixture.team_h_difficulty,
          difficultyAway: fixture.team_a_difficulty,
        },
        create: {
          fpl_id: fixture.id,
          gameweek: fixture.event,
          finished: fixture.finished,
          homeTeamId: fixture.team_h,
          awayTeamId: fixture.team_a,
          date: fixture.kickoff_time,
          difficultyHome: fixture.team_h_difficulty,
          difficultyAway: fixture.team_a_difficulty,
        },
      });
    }

    await this.matchPredictionService.generateMatchPredictions();
  }
}
