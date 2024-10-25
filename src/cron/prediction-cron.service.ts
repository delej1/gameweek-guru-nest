import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { DataPopulationService } from '../data-population/data-population.service';
import { FplDataService } from '../fpl/fpl.service';

@Injectable()
export class PredictionCronService {
    private readonly logger = new Logger(PredictionCronService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly fplDataService: FplDataService,
        private readonly dataPopulationService: DataPopulationService,
    ) { }

    // Cron job to check and make predictions every day at 11:00 AM
    @Cron(CronExpression.EVERY_DAY_AT_11AM)
    async handleCron() {
        this.logger.debug('Checking if predictions need to be made...');

        // Fetch the current game week
        const currentGameWeek = await this.fplDataService.getCurrentGameWeek();

        // Check for unfinished matches in the current game week
        const unfinishedFixtures = await this.prisma.fixtures.findMany({
            where: {
                gameweek: currentGameWeek,
                finished: false,
            },
        });

        if (unfinishedFixtures.length > 0) {
            this.logger.debug(
                `Game week ${currentGameWeek} still has unfinished fixtures. Waiting until all matches are completed.`,
            );
            return; // Exit the cron job if there are unfinished fixtures
        }

        // If all fixtures are completed, move to the next game week
        const nextGameWeek = currentGameWeek + 1;

        this.logger.debug(`All fixtures for game week ${currentGameWeek} finished. Generating predictions for game week ${nextGameWeek}...`);

        // Populate Teams first
        await this.dataPopulationService.populateTeams();

        // Populate Fixtures and trigger Match Predictions
        await this.dataPopulationService.populateFixtures();

        // Populate Players and trigger Player Predictions
        await this.dataPopulationService.populatePlayers();

        this.logger.debug(`Predictions for game week ${nextGameWeek} have been generated.`);
    }
}