import { Resolver, Mutation } from '@nestjs/graphql';
import { DataPopulationService } from './data-population.service';

@Resolver()
export class DataPopulationResolver {
  constructor(private readonly dataPopulationService: DataPopulationService) {}

  // This mutation triggers the data population and predictions
  @Mutation(() => Boolean)
  async populateAllData(): Promise<boolean> {
    // Populate Teams first
    await this.dataPopulationService.populateTeams();

    // Populate Players and trigger Player Predictions
    await this.dataPopulationService.populatePlayers();

    // Populate Fixtures and trigger Match Predictions
    await this.dataPopulationService.populateFixtures();

    return true;
  }
}